import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';
import deepmerge from 'deepmerge';
import { configSchema } from './schema/config';
export class Config {
    constructor(config) {
        this.titlePrefix = [];
        this.targetBranch = [];
        const parsedConfig = configSchema.parse(config);
        this.labels = parsedConfig.labels;
        this.titlePrefix = parsedConfig['title-prefix'];
        this.targetBranch = parsedConfig['target-branch'];
    }
    static async getConfig(octokit) {
        const path = getInput('config-path', { required: true });
        const overwriteMerge = (_defaultArray, configArray, _options) => configArray;
        const retrievedConfig = (await octokit.config.get(Object.assign(Object.assign({}, context.repo), { path, defaults: configs => deepmerge.all([this.defaults, ...configs], {
                arrayMerge: overwriteMerge,
            }) }))).config;
        debug(`Configuration '${path}': ${JSON.stringify(retrievedConfig)}`);
        if (Config.isConfigEmpty(retrievedConfig)) {
            throw new Error(`Missing configuration. Please setup 'Tracker Validator' Action using 'tracker-validator.yml' file.`);
        }
        return new this(retrievedConfig);
    }
    static isConfigEmpty(config) {
        return config === null || config === undefined;
    }
}
Config.defaults = {
    labels: {
        'dont-merge': 'dont-merge',
        'manual-merge': 'pr/needs-manual-merge',
    },
    'title-prefix': ['WIP:', '[WIP]:'],
    'target-branch': ['main', 'master'],
};
//# sourceMappingURL=config.js.map