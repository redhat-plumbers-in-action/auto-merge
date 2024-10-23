import BugzillaAPI from 'bugzilla';
import { raise } from './util';
export class Bugzilla {
    constructor(instance, apiToken) {
        this.instance = instance;
        this.apiToken = apiToken;
        this.api = new BugzillaAPI(instance, apiToken);
    }
    async getIssueDetails(id) {
        const response = (await this.api.getBugs([id]).include(['id', 'status']))[0];
        this.issueDetails = {
            id: response.id.toString(),
            status: response.status,
        };
        return this.issueDetails;
    }
    async getVersion() {
        return this.api.version();
    }
    async addMergeComment(title, branch, prLink) {
        if (this.issueDetails === undefined) {
            raise('Bugzilla.addMergeComment(): missing issueDetails, call Bugzilla.getIssueDetails() first.');
        }
        await this.api.createComment(+this.issueDetails.id, `PullRequest '${title}' - ${prLink} was merged to GitHub ${branch} branch.`, {
            is_private: true,
        });
        return `The merge comment was added to the Bugzilla bug - ${this.issueDetails.id}.`;
    }
}
//# sourceMappingURL=bugzilla.js.map