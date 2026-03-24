---
on:
  pull_request:
    types: [opened]
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
    max: 10
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
   implementation details.

## Step 4 — Post Comment

Post a single comment on the PR containing all suggestions. Use this
format:

---

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

---

Repeat the section above for each package that needs an entry.

If multiple packages are affected, list them all in a single comment.

## Step 5 — No Action Needed

If every affected package either has no `CHANGELOG.md` or already
includes a CHANGELOG update in this PR, call `noop` and do nothing.
