import BugzillaAPI from 'bugzilla';

import { Adapter, IssueDetails } from './controller';
import { raise } from './util';

export class Bugzilla implements Adapter<BugzillaAPI> {
  readonly api: BugzillaAPI;
  issueDetails: IssueDetails | undefined;

  constructor(
    readonly instance: string,
    private apiToken: string
  ) {
    this.api = new BugzillaAPI(instance, apiToken);
  }

  async getIssueDetails(id: string): Promise<IssueDetails> {
    const response = (
      await this.api.getBugs([id]).include(['id', 'status'])
    )[0];

    this.issueDetails = {
      id: response.id.toString(),
      status: response.status,
    };

    return this.issueDetails;
  }

  async getVersion(): Promise<string> {
    return this.api.version();
  }

  async addMergeComment(
    title: string,
    branch: string,
    prLink: string
  ): Promise<string> {
    if (this.issueDetails === undefined) {
      raise(
        'Bugzilla.addMergeComment(): missing issueDetails, call Bugzilla.getIssueDetails() first.'
      );
    }

    await this.api.createComment(
      +this.issueDetails.id,
      `PullRequest '${title}' - ${prLink} was merged to GitHub ${branch} branch.`,
      {
        is_private: true,
      }
    );

    return `The merge comment was added to the Bugzilla bug - ${this.issueDetails.id}.`;
  }
}
