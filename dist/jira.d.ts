import { Version2Client } from 'jira.js';
import { Adapter, IssueDetails } from './controller';
export declare class Jira implements Adapter<Version2Client> {
    readonly instance: string;
    readonly api: Version2Client;
    issueDetails: IssueDetails | undefined;
    constructor(instance: string, apiToken: string);
    getIssueDetails(id: string): Promise<IssueDetails>;
    getVersion(): Promise<string>;
    addMergeComment(title: string, branch: string, prLink: string): Promise<string>;
}
