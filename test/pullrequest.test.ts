import { test, expect, describe } from 'vitest';

import { PullRequest } from '../src/pull-request';
import { CustomOctokit } from '../src/octokit';

describe('test Pull Request class', () => {
  test('new PullRequest()', () => {
    const pr = new PullRequest(
      { number: 1, base: 'main', commits: [{ sha: 'abcd' }], url: 'pr-url' },
      'abcd',
      'owner',
      'repo',
      {} as CustomOctokit
    );

    expect(pr).toBeInstanceOf(PullRequest);
  });

  test.todo('initialize');
  test.todo('merge');
});
