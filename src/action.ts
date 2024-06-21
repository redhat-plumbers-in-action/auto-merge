import { debug, getInput } from '@actions/core';

import { Bugzilla } from './bugzilla';
import { Config } from './config';
import { Controller } from './controller';
import { Jira } from './jira';
import { CustomOctokit } from './octokit';
import { PullRequest } from './pull-request';
import {
  getFailedMessage,
  getSuccessMessage,
  raise,
  removeLabel,
  setLabels,
} from './util';

async function action(
  octokit: CustomOctokit,
  pr: PullRequest
): Promise<string> {
  const trackerType = getInput('tracker-type');
  const config = await Config.getConfig(octokit);

  let trackerController: Controller<Bugzilla | Jira> | undefined = undefined;

  switch (trackerType) {
    case 'bugzilla':
      const bzInstance = getInput('bugzilla-instance', { required: true });
      const bzAPIToken = getInput('bugzilla-api-token', { required: true });

      trackerController = new Controller(new Bugzilla(bzInstance, bzAPIToken));
      debug(
        `Using Bugzilla '${bzInstance}', version: '${await trackerController.adapter.getVersion()}'`
      );
      break;

    case 'jira':
      const jiraInstance = getInput('jira-instance', { required: true });
      const jiraAPIToken = getInput('jira-api-token', { required: true });

      trackerController = new Controller(new Jira(jiraInstance, jiraAPIToken));
      debug(
        `Using Jira '${jiraInstance}', version: '${await trackerController.adapter.getVersion()}'`
      );
      break;

    case 'none':
      debug(`No tracker specified`);
      break;

    default:
      raise(
        `🔴 Missing tracker or Unknown tracker type; type: '${trackerType}'`
      );
  }

  let message: string[] = [];
  let err: string[] = [];
  let labels: { add: string[] } = { add: [] };

  if (trackerController) {
    const tracker = getInput('tracker', { required: true });
    await trackerController.adapter.getIssueDetails(tracker);
  }

  if (pr.draft || pr.currentLabels.includes(config.labels['dont-merge'])) {
    err.push(
      `🔴 Pull Request is marked as draft or has \`${config.labels['dont-merge']}\` label`
    );
  } else {
    message.push(
      `🟢 Pull Request is not marked as draft and it's not blocked by \`${config.labels['dont-merge']}\` label`
    );
  }

  if (
    config.titlePrefix.map(prefix => pr.title.startsWith(prefix)).includes(true)
  ) {
    err.push(
      `🔴 Pull Request doesn't meet requirements. The title starts with the forbidden prefix: '${config.titlePrefix}'`
    );
  } else {
    message.push(`🟢 Pull Request meet requirements, title has correct form`);
  }

  if (pr.mergeable !== true) {
    err.push(
      `🔴 Pull Request can't be merged, \`mergeable\` is \`${pr.mergeable}\``
    );
  } else {
    message.push(
      `🟢 Pull Request meet requirements, \`mergeable\` is \`true\``
    );
  }

  switch (pr?.mergeableState) {
    case 'clean':
      message.push(
        `🟢 Pull Request meet requirements, \`mergeable_state\` is \`clean\``
      );
      break;

    case 'unstable':
      message.push(
        `🟠 Pull Request meet requirements, \`mergeable_state\` is \`unstable\``
      );
      break;

    default:
      // Mergeable state is seems to be broken - https://github.com/orgs/community/discussions/73849
      // Let's not block PRs because of that, we are checking the CI anyway
      message.push(
        `🟠 Pull Request doesn't meet requirements, \`mergeable_state\` is \`${pr?.mergeableState}\``
      );
  }

  // This check has to be last before merging action because it is setting manual-merge label
  if (!config.targetBranch.includes(pr.targetBranch)) {
    labels.add.push(config.labels['manual-merge']);
    err.push(
      `🔴 Pull Request has unsupported target branch \`${pr.targetBranch}\`, expected branches are: '${config.targetBranch}'`
    );
  } else {
    if (pr.currentLabels.includes(config.labels['manual-merge'])) {
      removeLabel(octokit, pr.number, config.labels['manual-merge']);
    }
    message.push(
      `🟢 Pull Request has correct target branch \`${pr.targetBranch}\``
    );
  }

  if (err.length == 0) {
    debug(`No errors found, merging pull request`);
    const isMerged = await pr.merge();

    if (isMerged) {
      debug(`Pull Request was merged`);

      if (trackerController) {
        await trackerController.adapter.addMergeComment(
          pr.title,
          pr.targetBranch,
          pr.url
        );
      }

      message.push(`🟢 Pull Request was merged`);
      if (pr.currentLabels.includes(config.labels['manual-merge'])) {
        removeLabel(octokit, pr.number, config.labels['manual-merge']);
      }
    } else {
      err.push(`🔴 Pull Request failed to merge, needs manual merge`);
      labels.add.push(config.labels['manual-merge']);
    }
  }

  setLabels(octokit, pr.number, labels.add);

  if (err.length > 0) {
    raise(getFailedMessage(err) + '\n\n' + getSuccessMessage(message));
  }

  return getSuccessMessage(message);
}

export default action;
