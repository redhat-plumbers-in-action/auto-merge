import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';
import deepmerge from 'deepmerge';

import { CustomOctokit } from './octokit';

import { configSchema, ConfigLabels, ConfigType } from './schema/config';

export class Config {
  static readonly defaults: Partial<ConfigType> = {
    labels: {
      'dont-merge': 'dont-merge',
      'manual-merge': 'pr/needs-manual-merge',
    },
    'title-prefix': ['WIP:', '[WIP]:'],
    'target-branch': ['main', 'master'],
  };
  labels: ConfigLabels;
  titlePrefix: ConfigType['title-prefix'] = [];
  targetBranch: ConfigType['target-branch'] = [];

  constructor(config: unknown) {
    const parsedConfig = configSchema.parse(config);
    this.labels = parsedConfig.labels;
    this.titlePrefix = parsedConfig['title-prefix'];
    this.targetBranch = parsedConfig['target-branch'];
  }

  static async getConfig(octokit: CustomOctokit): Promise<Config> {
    const path = getInput('config-path', { required: true });

    const overwriteMerge = (
      _defaultArray: string[],
      configArray: string[],
      _options?: deepmerge.Options
    ) => configArray;

    const retrievedConfig = (
      await octokit.config.get({
        ...context.repo,
        path,
        defaults: configs =>
          deepmerge.all([this.defaults, ...configs], {
            arrayMerge: overwriteMerge,
          }) as Partial<Config>,
      })
    ).config;

    debug(`Configuration '${path}': ${JSON.stringify(retrievedConfig)}`);

    if (Config.isConfigEmpty(retrievedConfig)) {
      throw new Error(
        `Missing configuration. Please setup 'Tracker Validator' Action using 'tracker-validator.yml' file.`
      );
    }

    return new this(retrievedConfig);
  }

  static isConfigEmpty(config: unknown) {
    return config === null || config === undefined;
  }
}
