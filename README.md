<!-- markdownlint-disable MD033 MD041 -->
<p align="center">
  <img src="https://github.com/redhat-plumbers-in-action/team/blob/b14def90ad269c032b1d00c6aa3a82b23dffc562/members/yellow-plumber.png" width="100" />
  <h1 align="center">Auto Merge</h1>
</p>

[![GitHub Marketplace][market-status]][market] [![Lint Code Base][linter-status]][linter] [![Unit Tests][test-status]][test] [![CodeQL][codeql-status]][codeql] [![Check dist/][check-dist-status]][check-dist]

[![codecov][codecov-status]][codecov]

<!-- Status links -->

[market]: https://github.com/marketplace/actions/auto-merge
[market-status]: https://img.shields.io/badge/Marketplace-Auto%20Merge-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEZPfsVJ61jbxaF0cRQRcRJ9hlYn30IHN/+9iquDCOIsblIrOjqKgy5aKoJQj4O3EEtbPwhJbr6Te28CmdSKeqzeqr0YbfVIrTBKakvtOl5dtTkK+v4HfA9PEyBFCY9AGVgCBLaBp1jPAyfAJ/AAdIEG0dNAiyP7+K1qIfMdonZic6+WJoBJvQlvuwDqcXadUuqPA1NKAlexbRTAIMvMOCjTbMwl1LtI/6KWJ5Q6rT6Ht1MA58AX8Apcqqt5r2qhrgAXQC3CZ6i1+KMd9TRu3MvA3aH/fFPnBodb6oe6HM8+lYHrGdRXW8M9bMZtPXUji69lmf5Cmamq7quNLFZXD9Rq7v0Bpc1o/tp0fisAAAAASUVORK5CYII=

[linter]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/lint.yml
[linter-status]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/lint.yml/badge.svg

[test]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/unit-tests.yml
[test-status]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/unit-tests.yml/badge.svg

[codeql]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/codeql-analysis.yml
[codeql-status]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/codeql-analysis.yml/badge.svg

[check-dist]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/check-dist.yml
[check-dist-status]: https://github.com/redhat-plumbers-in-action/auto-merge/actions/workflows/check-dist.yml/badge.svg

[codecov]: https://codecov.io/gh/redhat-plumbers-in-action/auto-merge
[codecov-status]: https://codecov.io/gh/redhat-plumbers-in-action/auto-merge/branch/main/graph/badge.svg

<!-- -->

Auto Merge is a GitHub Action that automaticaly merges Pull Requests. It works best togetger with [Advanced Commit Linter](https://github.com/redhat-plumbers-in-action/advanced-commit-linter), [Tracker Validator](https://github.com/redhat-plumbers-in-action/tracker-validator) and [Pull Request Validator](https://github.com/redhat-plumbers-in-action/pull-request-validator) GitHub Actions. But it can be used separately.

## Features

* Ability to merge Pull Request automatically
* Ability to block merge of Pull Request based on Pull Request title and labels
* Ability to set ready to merge label on Pull Request

## Usage

```yml
name: Gather Pull Request Metadata
on:
  pull_request:
    types: [ opened, reopened, synchronize ]
    branches: [ main ]

permissions:
  contents: read

jobs:
  gather-metadata:
    runs-on: ubuntu-latest

    steps:
      - name: Repository checkout
        uses: actions/checkout@v4

      - id: Metadata
        name: Gather Pull Request Metadata
        uses: redhat-plumbers-in-action/gather-pull-request-metadata@v1

      - name: Upload artifact with gathered metadata
        uses: actions/upload-artifact@v4
        with:
          name: pr-metadata
          path: ${{ steps.Metadata.outputs.metadata-file }}
```

```yml
name: Pull Request Validator
on:
  workflow_run:
    workflows: [ Gather Pull Request Metadata ]
    types:
      - completed

permissions:
  contents: read

jobs:
  download-metadata:
    if: >
      github.event.workflow_run.event == 'pull_request' &&
      github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest

    outputs:
      pr-metadata: ${{ steps.Artifact.outputs.pr-metadata-json }}

    steps:
      - id: Artifact
        name: Download Artifact
        uses: redhat-plumbers-in-action/download-artifact@v1
        with:
          name: pr-metadata

  auto-merge:
    needs: [ download-metadata ]
    runs-on: ubuntu-latest

    permissions:
      # required for ability to merge Pull Request
      contents: write
      # required for status checks
      checks: write
      # required for setting labels
      pull-requests: write

    steps:
      - id: commit-linter
        name: Commit Linter
        uses: redhat-plumbers-in-action/advanced-commit-linter@v2
        with:
          pr-metadata: ${{ needs.download-metadata.outputs.pr-metadata }}
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Auto Merge
        uses: redhat-plumbers-in-action/auto-merge@v2
        with:
          pr-metadata: ${{ needs.download-metadata.outputs.pr-metadata }}
          tracker: ${{ fromJSON(steps.commit-linter.outputs.validated-pr-metadata).validation.tracker.id }}
          tracker-type: ${{ fromJSON(steps.commit-linter.outputs.validated-pr-metadata).validation.tracker.type }}
          bugzilla-instance: https://bugzilla.redhat.com
          bugzilla-api-token: ${{ secrets.BUGZILLA_API_TOKEN }}
          jira-instance: https://issues.redhat.com
          jira-api-token: ${{ secrets.JIRA_API_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration options

Action currently accepts the following options:

```yml
# ...

- uses: redhat-plumbers-in-action/auto-merge@v2
  with:
    pr-metadata:        <pr-metadata.json>
    config-path:        <path to config file>
    tracker:            <tracker ID>
    tracker-type:       <tracker type>
    bugzilla-instance:  <Bugzilla instance URL>
    bugzilla-api-token: <Bugzilla API token>
    jira-instance:      <Jira instance URL>
    jira-api-token:    <Jira API token>
    set-status:         <true or false>
    status-title:       <status title>
    token:              <GitHub token or PAT>

# ...
```

### pr-metadata

Stringified JSON Pull Request metadata provided by GitHub Action [`redhat-plumbers-in-action/gather-pull-request-metadata`](https://github.com/redhat-plumbers-in-action/gather-pull-request-metadata).

Pull Request metadata has the following format: [metadata format](https://github.com/redhat-plumbers-in-action/gather-pull-request-metadata#metadata)

* default value: `undefined`
* requirements: `required`

### config-path

Path to configuration file. Configuration file format is described in: [Configuration section](#configuration).

* default value: `.github/tracker-validator.yml`
* requirements: `optional`

### tracker

The tracker identificator. For example, for Bugzilla: `tracker: 1234567`.

* default value: `undefined`
* requirements: `optional`

### tracker-type

The tracker type. Currently supported: `bugzilla`, `jira`, and `none`. When defined, then also `tracker` input has to be defined.

* default value: `none`
* requirements: `optional`

### bugzilla-instance

The URL of the Bugzilla instance on which will be performed API requests and validation of trackers. For example: `bugzilla-instance: https://bugzilla.redhat.com`.

* default value: `undefined`
* requirements: `optional`

### bugzilla-api-token

The Bugzilla API token is used for performing API requests. The token should be stored as GitHub secret. Never paste the token directly into the workflow file.

* default value: `undefined`
* requirements: `optional`

### jira-instance

The URL of the Jira instance on which will be performed API requests and validation of trackers. For example: `jira-instance: https://issues.redhat.com`.

* default value: `undefined`
* requirements: `required`

### jira-api-token

The Jira API token is used for performing API requests. The token should be stored as GitHub secret. Never paste the token directly into the workflow file.

* default value: `undefined`
* requirements: `optional`

### set-status

Set status on Pull Request. If enabled, Action will create check-run status with validation results.

* default value: `false`
* requirements: `optional`

### status-title

Optional H3 title of status message.

* default value: `Auto Merge`
* requirements: `optional`

### token

GitHub token or PAT is used for creating comments on Pull Request and setting checks.

```yml
# required permission
permissions:
  contents: write
  checks: write
  pull-requests: write
```

* default value: `undefined`
* requirements: `required`
* recomended value: `secrets.GITHUB_TOKEN`

## Outputs

### `status`

Message with status of Auto Merge action.

## Configuration

Action can be additionally configured by creating a configuration file in the repository. The configuration file should be placed in `.github/auto-merge.yml` (it can be changed by setting `config-path` option). The configuration file has the following format:

```yml
labels:
  dont-merge: dont-merge
  manual-merge: pr/needs-manual-merge
title-prefix': ['WIP:', '[WIP]:']
target-branch': ['main', 'master']
```

### `labels` keyword

Allows you to set custom labels for certain conditions.

#### `dont-merge` keyword

The name of the label that will block the merge of the Pull Request.

* default value: `dont-merge`

#### `manual-merge` keyword

The name of the label that will be set on the Pull Request if the merge have to be performed manually.

* default value: `pr/needs-manual-merge`

### `title-prefix` keyword

The list of Pull Request title prefixes that will block the merge of the Pull Request. Usually used for marking Pull Request as Work In Progress.

* default value: `['WIP:', '[WIP]:']`

### `target-branch` keyword

The target branches on which the Pull Request will be automatically merged. If the Pull Request is not targeting any of the listed branches and all requirements are satisfied, the Pull Request will be marked by a `manual-merge` label.

* default value: `['main', 'master']`

## Limitations

* Status checks from Pull Request Validator are randomly assigned to check suites, GitHub API for check suites doesn't provide a way to assign a check to a specific suite.
* Specific branch protection rules might block the merge of a Pull Request even if all requirements are satisfied. If you encounter a message like this: `Error: You're not authorized to push to this branch. Visit https://docs.github.com/articles/about-protected-branches/ for more information.` you should check your branch protection rules. The issue is usually caused by the `Restrict who can push to matching branches` option.
