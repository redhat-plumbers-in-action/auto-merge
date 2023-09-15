import BugzillaAPI from 'bugzilla';
import { Version2Client } from 'jira.js';
import { Bugzilla } from './bugzilla';
import { Jira } from './jira';
export interface Adapter<T> {
    readonly api: T;
    readonly instance: string;
    getIssueDetails(id: string): Promise<IssueDetails>;
    getVersion(): Promise<string>;
    addMergeComment(title: string, branch: string, prLink: string): Promise<string>;
}
export type IssueDetails = {
    id: string;
    status: string;
};
export type Flag = {
    name: string;
    status: string;
};
export type SupportedControllers = Bugzilla | Jira;
export type SupportedAdapters<T extends SupportedControllers> = T extends Bugzilla ? BugzillaAPI : T extends Jira ? Version2Client : never;
export declare class Controller<T extends SupportedControllers> {
    readonly adapter: Adapter<SupportedAdapters<T>>;
    constructor(adapter: Adapter<SupportedAdapters<T>>);
}
