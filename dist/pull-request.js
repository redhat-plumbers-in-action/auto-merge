import { debug } from '@actions/core';
import { context } from '@actions/github';
import { pullRequestApiSchema } from './schema/pull-request';
export class PullRequest {
    constructor(metadata, ref, octokit) {
        this.ref = ref;
        this.octokit = octokit;
        this.title = '';
        this.targetBranch = '';
        this.mergeable = null;
        this.mergeableState = 'unknown';
        this.currentLabels = [];
        this.number = metadata.number;
        this.url = metadata.url;
    }
    async initialize() {
        const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', Object.assign(Object.assign({}, context.repo), { pull_number: this.number, headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            } }));
        debug(`Pull Request: ${JSON.stringify(data)}`);
        const safeData = pullRequestApiSchema.parse(data);
        this.title = safeData.title;
        this.targetBranch = safeData.base;
        this.mergeable = safeData.mergeable;
        this.mergeableState = safeData.mergeable_state;
        this.currentLabels = safeData.labels;
        this.draft = safeData.draft;
    }
    async merge() {
        const { data } = await this.octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', Object.assign(Object.assign({}, context.repo), { pull_number: this.number, sha: this.ref, merge_method: 'rebase' }));
        return data.merged;
    }
}
//# sourceMappingURL=pull-request.js.map