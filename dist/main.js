import { getBooleanInput, getInput, setFailed, setOutput } from '@actions/core';
import { context } from '@actions/github';
import '@total-typescript/ts-reset';
import action from './action';
import { AutoMergeError } from './error';
import { getOctokit } from './octokit';
import { PullRequest } from './pull-request';
import { updateStatusCheck } from './util';
import { pullRequestMetadataSchema } from './schema/input';
const octokit = getOctokit(getInput('token', { required: true }));
const prMetadataUnsafe = JSON.parse(getInput('pr-metadata', { required: true }));
const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
const commitSha = prMetadata.commits[prMetadata.commits.length - 1].sha;
const setStatus = getBooleanInput('set-status', { required: true });
let checkRunID;
if (setStatus) {
    checkRunID = (await octokit.request('POST /repos/{owner}/{repo}/check-runs', Object.assign(Object.assign({}, context.repo), { name: 'Auto Merge', head_sha: commitSha, status: 'in_progress', started_at: new Date().toISOString(), output: {
            title: 'Auto Merge',
            summary: 'Auto Merge in progress ...',
        } }))).data.id;
}
const statusTitle = getInput('status-title', { required: true });
try {
    const pr = new PullRequest(prMetadata, commitSha, octokit);
    await pr.initialize();
    let message = await action(octokit, pr);
    if (setStatus && checkRunID) {
        await updateStatusCheck(octokit, checkRunID, 'completed', 'success', message);
    }
    if (statusTitle.length > 0) {
        message = `### ${statusTitle}\n\n${message}`;
    }
    setOutput('status', JSON.stringify(message));
}
catch (error) {
    let message;
    if (error instanceof Error) {
        message = error.message;
    }
    else {
        message = JSON.stringify(error);
    }
    if (setStatus && checkRunID) {
        await updateStatusCheck(octokit, checkRunID, 'completed', 'failure', message);
    }
    if (statusTitle.length > 0) {
        message = `### ${statusTitle}\n\n${message}`;
    }
    // set status output only if error was thrown by us
    if (error instanceof AutoMergeError) {
        setOutput('status', JSON.stringify(message));
    }
    setFailed(message);
}
//# sourceMappingURL=main.js.map