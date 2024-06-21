import { CustomOctokit } from './octokit';
import { ConfigLabels, ConfigType } from './schema/config';
export declare class Config {
    static readonly defaults: Partial<ConfigType>;
    labels: ConfigLabels;
    titlePrefix: ConfigType['title-prefix'];
    targetBranch: ConfigType['target-branch'];
    constructor(config: unknown);
    static getConfig(octokit: CustomOctokit): Promise<Config>;
    static isConfigEmpty(config: unknown): config is null | undefined;
}
