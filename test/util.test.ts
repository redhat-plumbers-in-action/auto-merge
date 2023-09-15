import { describe, expect, test } from 'vitest';

import { getFailedMessage, getSuccessMessage, raise } from '../src/util';

describe('test basic utility functions', () => {
  test.todo('updateStatusCheck()', async () => {});

  test('getFailedMessage()', () => {
    let errors: string[] = [];
    let message = getFailedMessage(errors);

    expect(message).toEqual('');

    errors = ['error1', 'error2'];
    message = getFailedMessage(errors);

    expect(message).toMatchInlineSnapshot(`
      "### Failed

      error1
      error2"
    `);
  });

  test('getSuccessMessage()', () => {
    let success: string[] = [];
    let message = getSuccessMessage(success);

    expect(message).toEqual('');

    success = ['success1', 'success2'];
    message = getSuccessMessage(success);

    expect(message).toMatchInlineSnapshot(`
      "### Success

      success1
      success2"
    `);
  });

  test('raise()', () =>
    expect(() => raise('new error')).toThrow(new Error('new error')));

  test.todo('setLabels()', async () => {});

  test.todo('removeLabel()', async () => {});
});
