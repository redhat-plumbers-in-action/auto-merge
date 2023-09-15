import { Config } from '../../src/config';

export interface ConfigTestContext {
  configs: Config[];
}

export const configContextFixture: ConfigTestContext = {
  configs: [
    new Config({
      labels: {
        'dont-merge': 'dont-merge',
        'manual-merge': 'pr/needs-manual-merge',
      },
      'title-prefix': ['WIP:', '[WIP]:'],
      'target-branch': ['main', 'master'],
    }),
  ],
};
