import { debug } from '@actions/core';
import { context } from '@actions/github';

import { CustomOctokit } from './octokit';

import { PullRequestApi, pullRequestApiSchema } from './schema/pull-request';
import { PullRequestMetadata } from './schema/input';

export class PullRequest {
  readonly number: number;
  readonly url: string;

  title: PullRequestApi['title'] = '';
  targetBranch: PullRequestApi['base'] = '';
  mergeable: PullRequestApi['mergeable'] = null;
  mergeableState: PullRequestApi['mergeable_state'] = 'unknown';
  draft: PullRequestApi['draft'];
  currentLabels: PullRequestApi['labels'] = [];

  constructor(
    metadata: PullRequestMetadata,
    readonly ref: string,
    readonly octokit: CustomOctokit
  ) {
    this.number = metadata.number;
    this.url = metadata.url;
  }

  async initialize() {
    const { data } = await this.octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}',
      {
        ...context.repo,
        pull_number: this.number,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    debug(`Pull Request: ${JSON.stringify(data)}`);
    const safeData = pullRequestApiSchema.parse(data);

    this.title = safeData.title;
    this.targetBranch = safeData.base;
    this.mergeable = safeData.mergeable;
    this.mergeableState = safeData.mergeable_state;
    this.currentLabels = safeData.labels;
    this.draft = safeData.draft;
  }

  async merge(): Promise<boolean> {
    const { data } = await this.octokit.request(
      'PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge',
      {
        ...context.repo,
        pull_number: this.number,
        sha: this.ref,
        merge_method: 'rebase',
      }
    );

    return data.merged;
  }
}
