import { Version2Client } from 'jira.js';
import { raise } from './util';
export class Jira {
    constructor(instance, apiToken) {
        this.instance = instance;
        this.api = new Version2Client({
            host: instance,
            authentication: {
                personalAccessToken: apiToken,
            },
        });
    }
    async getIssueDetails(id) {
        var _a;
        const response = await this.api.issues.getIssue({ issueIdOrKey: id });
        this.issueDetails = {
            id: response.key,
            status: (_a = response.fields.status.name) !== null && _a !== void 0 ? _a : '',
        };
        return this.issueDetails;
    }
    async getVersion() {
        var _a;
        const response = await this.api.serverInfo.getServerInfo();
        return (_a = response.version) !== null && _a !== void 0 ? _a : raise('Jira.getVersion(): missing version.');
    }
    async addMergeComment(title, branch, prLink) {
        if (this.issueDetails === undefined) {
            raise('Jira.addMergeComment(): missing issueDetails, call Jira.getIssueDetails() first.');
        }
        await this.api.issueComments.addComment({
            issueIdOrKey: this.issueDetails.id,
            comment: `PullRequest [${title}|${prLink}] was merged to GitHub ${branch} branch.`,
            visibility: {
                type: 'group',
                value: 'Red Hat Employee',
            },
        });
        return `The merge comment was added to the Jira issue - ${this.issueDetails.id}.`;
    }
}
//# sourceMappingURL=jira.js.map