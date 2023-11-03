import { getInput, setFailed } from '@actions/core';
import { z } from 'zod';

import '@total-typescript/ts-reset';

import action from './action';
import { getOctokit } from './octokit';
import { PullRequest } from './pull-request';
import { updateStatusCheck } from './util';

import { pullRequestMetadataSchema } from './schema/input';

const octokit = getOctokit(getInput('token', { required: true }));

const owner = z
  .string()
  .min(1)
  .parse(process.env.GITHUB_REPOSITORY?.split('/')[0]);
const repo = z
  .string()
  .min(1)
  .parse(process.env.GITHUB_REPOSITORY?.split('/')[1]);

const prMetadataUnsafe = JSON.parse(
  getInput('pr-metadata', { required: true })
);

const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
const commitSha = prMetadata.commits[prMetadata.commits.length - 1].sha;

const checkRunID = (
  await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
    owner,
    repo,
    name: 'Auto Merge',
    head_sha: commitSha,
    status: 'in_progress',
    started_at: new Date().toISOString(),
    output: {
      title: 'Auto Merge',
      summary: 'Auto Merge in progress ...',
    },
  })
).data.id;

try {
  const pr = new PullRequest(prMetadata, commitSha, owner, repo, octokit);
  await pr.initialize();
  const message = await action(octokit, owner, repo, pr);

  await updateStatusCheck(
    octokit,
    checkRunID,
    owner,
    repo,
    'completed',
    'success',
    message
  );
} catch (error) {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else {
    message = JSON.stringify(error);
  }

  setFailed(message);
  await updateStatusCheck(
    octokit,
    checkRunID,
    owner,
    repo,
    'completed',
    'failure',
    message
  );
}
