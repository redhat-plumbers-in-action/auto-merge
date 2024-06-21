import { CustomOctokit } from './octokit';
import { PullRequestApi } from './schema/pull-request';
import { PullRequestMetadata } from './schema/input';
export declare class PullRequest {
    readonly ref: string;
    readonly octokit: CustomOctokit;
    readonly number: number;
    readonly url: string;
    title: PullRequestApi['title'];
    targetBranch: PullRequestApi['base'];
    mergeable: PullRequestApi['mergeable'];
    mergeableState: PullRequestApi['mergeable_state'];
    draft: PullRequestApi['draft'];
    currentLabels: PullRequestApi['labels'];
    constructor(metadata: PullRequestMetadata, ref: string, octokit: CustomOctokit);
    initialize(): Promise<void>;
    merge(): Promise<boolean>;
}
