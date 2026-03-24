---
on:
  pull_request_target:
    types: [synchronize]
    paths:
      - "sdk/**/src/**"
      - "sdk/**/package.json"
description: "Check for missing CHANGELOG entries and suggest additions for affected packages"
permissions:
  contents: read
  pull-requests: read
tools:
  github:
    toolsets: [context, repos, pull_requests]
safe-outputs:
  add-comment:
    max: 1
    target: "triggering"
    hide-older-comments: true
  noop:
---

# CHANGELOG Entry Checker

Check pull request #${{ github.event.pull_request.number }} for missing
CHANGELOG entries in affected packages, and suggest entries if needed.

## Repository Structure

This is a monorepo. Packages live under `sdk/<service>/<package>/`. Each
package may have a `CHANGELOG.md` at its root. The CHANGELOG format is:

```
# Release History

## <version> (Unreleased)

### Features Added

### Breaking Changes

### Bugs Fixed

### Other Changes
```

Categories are: **Features Added**, **Breaking Changes**, **Bugs Fixed**,
and **Other Changes**.

## Step 1 — Identify Affected Packages

1. List all files changed in the PR using the GitHub API.
2. For each changed file, extract the package path. A package is
   identified by a path matching `sdk/<service>/<package>/`. For example,
   `sdk/storage/storage-blob/src/index.ts` belongs to package
   `sdk/storage/storage-blob`.
3. Only consider files under `src/` or files named `package.json` within
   a package directory as qualifying changes.
4. Collect the unique set of affected packages.

## Step 2 — Check for Existing CHANGELOG Entries

For each affected package:

1. Check whether `CHANGELOG.md` exists in the package root. If the
   package has no `CHANGELOG.md`, skip it.
2. Check whether `CHANGELOG.md` is among the files changed in this PR.
   If the PR already modifies the CHANGELOG, that package needs no
   suggestion — skip it.

## Step 3 — Generate CHANGELOG Suggestions

For each affected package that is missing a CHANGELOG update:

1. Read the PR title, PR description, and the diffs for that package's
   changed files.
2. Read the existing `CHANGELOG.md` to find the topmost version section
   (usually an `(Unreleased)` section or the latest version).
3. Determine the most appropriate category for the change:
   - **Features Added** — new APIs, new options, new functionality
   - **Breaking Changes** — removed or renamed APIs, changed defaults,
     signature changes
   - **Bugs Fixed** — bug fixes, error handling improvements
   - **Other Changes** — dependency updates, internal refactors,
     documentation, test improvements
4. Write a concise, one- or two-line CHANGELOG entry describing the
   change from the user's perspective. Do not mention internal
   implementation details. Always append a PR link at the end of the
   entry in the format `(PR #<number>)[<pr url>]`. Use the PR number
   and HTML URL from the pull request event context. For example:
   `- Added xyz feature. (PR #12345)[https://github.com/Azure/azure-sdk-for-js/pull/12345]`

## Step 4 — Post Comment

There are two cases:

### Case A — Missing CHANGELOG entries found

Post a comment on the PR using `add-comment` with the suggestions.
Any previous comment from this workflow will be automatically minimized
(hidden) and replaced.

Format the comment body as follows:

📝 **CHANGELOG Entry Suggestions**

The following packages have `src/` or `package.json` changes but no
corresponding CHANGELOG update in this PR:

### `<package-name>` (`sdk/<service>/<package>`)

**Suggested category:** `<category>`

```
- <suggested entry text>
```

✏️ [Edit CHANGELOG.md on this branch](https://github.com/${{ github.repository }}/edit/<head-branch>/sdk/<service>/<package>/CHANGELOG.md)
— paste the entry under the topmost version heading.

Replace `<head-branch>` with the PR's head branch name obtained from the
GitHub API (the `head.ref` field of the pull request object).

Repeat the package section for each package that needs an entry.
List all packages in a single comment.

### Case B — All CHANGELOG entries are present

If every affected package either has no `CHANGELOG.md` or already
includes a CHANGELOG update in this PR, post a comment using
`add-comment` confirming the entries are present. The previous comment
(with the suggestions) will be automatically hidden.

Format the comment body as follows:

✅ **All CHANGELOG entries provided**

All affected packages have corresponding CHANGELOG updates in this PR.

<details>
<summary>Previous suggestions (resolved)</summary>

<previous suggestions content — reproduce the full suggestion text
from Step 3 here so the author can still reference it>

</details>

To generate the collapsed section, re-run the CHANGELOG suggestion
logic from Step 3 as though entries were still missing, and include
the generated suggestions inside the `<details>` block. This way the
author can still see what was originally suggested.

## Step 5 — No Affected Packages

If there are no affected packages at all (no packages with a
`CHANGELOG.md` had qualifying `src/` or `package.json` changes),
call `noop` and do nothing.
