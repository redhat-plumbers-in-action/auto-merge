import BugzillaAPI from 'bugzilla';
import { Adapter, IssueDetails } from './controller';
export declare class Bugzilla implements Adapter<BugzillaAPI> {
    readonly instance: string;
    private apiToken;
    readonly api: BugzillaAPI;
    issueDetails: IssueDetails | undefined;
    constructor(instance: string, apiToken: string);
    getIssueDetails(id: string): Promise<IssueDetails>;
    getVersion(): Promise<string>;
    addMergeComment(title: string, branch: string, prLink: string): Promise<string>;
}
