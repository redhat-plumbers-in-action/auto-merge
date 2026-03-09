import { Version3Client } from 'jira.js';

import { Adapter, IssueDetails } from './controller';
import { raise } from './util';

export class Jira implements Adapter<Version3Client> {
  readonly api: Version3Client;
  issueDetails: IssueDetails | undefined;

  constructor(
    readonly instance: string,
    apiToken: string,
    email: string
  ) {
    this.api = new Version3Client({
      host: instance,
      authentication: {
        basic: {
          email,
          apiToken,
        },
      },
    });
  }

  async getIssueDetails(id: string): Promise<IssueDetails> {
    const response = await this.api.issues.getIssue({ issueIdOrKey: id });

    this.issueDetails = {
      id: response.key,
      status: response.fields.status.name ?? '',
    };

    return this.issueDetails;
  }

  async getVersion(): Promise<string> {
    const response = await this.api.serverInfo.getServerInfo();
    return response.version ?? raise('Jira.getVersion(): missing version.');
  }

  async addMergeComment(
    title: string,
    branch: string,
    prLink: string
  ): Promise<string> {
    if (this.issueDetails === undefined) {
      raise(
        'Jira.addMergeComment(): missing issueDetails, call Jira.getIssueDetails() first.'
      );
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
