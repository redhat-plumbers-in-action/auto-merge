import { CustomOctokit } from './octokit';
import { PullRequestMetadata } from './schema/input';
export declare class PullRequest {
    readonly ref: string;
    readonly owner: string;
    readonly repo: string;
    readonly octokit: CustomOctokit;
    readonly number: number;
    readonly url: string;
    title: string;
    targetBranch: string;
    mergeableState: string;
    draft: boolean | undefined;
    currentLabels: string[];
    constructor(metadata: PullRequestMetadata, ref: string, owner: string, repo: string, octokit: CustomOctokit);
    initialize(): Promise<void>;
    merge(): Promise<boolean>;
}
