import { getInput, isDebug } from '@actions/core';
import { pullRequestApiSchema } from './schema/pull-request';
import { debug } from 'console';
export class PullRequest {
    constructor(metadata, ref, owner, repo, octokit) {
        this.ref = ref;
        this.owner = owner;
        this.repo = repo;
        this.octokit = octokit;
        this.title = '';
        this.targetBranch = '';
        this.mergeableState = 'unknown';
        this.currentLabels = [];
        this.number = metadata.number;
        this.url = metadata.url;
    }
    async initialize() {
        const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
            owner: this.owner,
            repo: this.repo,
            pull_number: this.number,
            headers: {
                authorization: `token ${getInput('token', { required: true })}`,
            },
        });
        isDebug() && debug(`Pull Request: ${JSON.stringify(data)}`);
        const safeData = pullRequestApiSchema.parse(data);
        this.title = safeData.title;
        this.targetBranch = safeData.base;
        this.mergeableState = safeData.mergeable_state;
        this.currentLabels = safeData.labels;
        this.draft = safeData.draft;
    }
    async merge() {
        const { data } = await this.octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
            owner: this.owner,
            repo: this.repo,
            pull_number: this.number,
            sha: this.ref,
            merge_method: 'rebase',
        });
        return data.merged;
    }
}
//# sourceMappingURL=pull-request.js.map