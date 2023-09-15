import { describe, expect, expectTypeOf, test } from 'vitest';

import BugzillaAPI from 'bugzilla';
import { Version2Client } from 'jira.js';

import {
  Controller,
  SupportedAdapters,
  SupportedControllers,
} from '../src/controller';

import { Bugzilla } from '../src/bugzilla';
import { Jira } from '../src/jira';

describe('test class Controller', () => {
  test('type SupportedControllers', () => {
    expectTypeOf<SupportedControllers>().toEqualTypeOf<Bugzilla | Jira>();
  });

  test('type SupportedAdapters', () => {
    expectTypeOf<SupportedAdapters<Bugzilla>>().toEqualTypeOf<BugzillaAPI>();
    expectTypeOf<SupportedAdapters<Jira>>().toEqualTypeOf<Version2Client>();
    expectTypeOf<SupportedAdapters<never>>().toBeNever();
  });

  test('new Controller()', () => {
    const bugzilla = new Controller(
      new Bugzilla('https://bugzilla.redhat.com', 'token')
    );

    expect(bugzilla).toBeInstanceOf(Controller<Bugzilla>);
    expect(bugzilla.adapter).toBeInstanceOf(Bugzilla);
    expect(bugzilla.adapter.api).toBeInstanceOf(BugzillaAPI);

    const jira = new Controller(new Jira('https://issues.redhat.com', 'token'));

    expect(jira).toBeInstanceOf(Controller<Jira>);
    expect(jira.adapter).toBeInstanceOf(Jira);
    expect(jira.adapter.api).toBeInstanceOf(Version2Client);
  });
});
