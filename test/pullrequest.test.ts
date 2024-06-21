import { test, expect, describe, beforeEach, vi, afterEach } from 'vitest';

import { PullRequest } from '../src/pull-request';
import { CustomOctokit } from '../src/octokit';

describe('test Pull Request class', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_REPOSITORY', 'test/test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('new PullRequest()', () => {
    const pr = new PullRequest(
      { number: 1, base: 'main', commits: [{ sha: 'abcd' }], url: 'pr-url' },
      'abcd',
      {} as CustomOctokit
    );

    expect(pr).toBeInstanceOf(PullRequest);
  });

  test.todo('initialize');
  test.todo('merge');
});
