import { debug } from '@actions/core';
import { context } from '@actions/github';
import { AutoMergeError } from './error';
// Update check run - check completed + conclusion
// ! Allow specifying workflow run when creating a checkrun from a GitHub workflow
// !FIXME: Issue - https://github.com/orgs/community/discussions/14891#discussioncomment-6110666
// !FIXME: Issue - https://github.com/orgs/community/discussions/24616
export async function updateStatusCheck(octokit, checkID, status, conclusion, message) {
    await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', Object.assign(Object.assign({}, context.repo), { check_run_id: checkID, status, completed_at: new Date().toISOString(), conclusion, output: {
            title: 'Tracker Validation',
            summary: message,
        } }));
}
export function getFailedMessage(error) {
    if (error.length === 0) {
        return '';
    }
    return '#### Failed' + '\n\n' + error.join('\n');
}
export function getSuccessMessage(message) {
    if (message.length === 0) {
        return '';
    }
    return '#### Success' + '\n\n' + message.join('\n');
}
export async function setLabels(octokit, issueNumber, labels) {
    if (labels.length === 0) {
        debug('No labels to set');
        return;
    }
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', Object.assign(Object.assign({}, context.repo), { issue_number: issueNumber, labels }));
}
export async function removeLabel(octokit, issueNumber, label) {
    await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', Object.assign(Object.assign({}, context.repo), { issue_number: issueNumber, name: label }));
}
export function raise(error) {
    throw new AutoMergeError(error);
}
//# sourceMappingURL=util.js.map