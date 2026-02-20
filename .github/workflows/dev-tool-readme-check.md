---
description: Check that the dev-tool README is updated when CLI commands change
on:
  pull_request:
    paths:
      - "common/tools/dev-tool/src/**"
permissions:
  contents: read
  pull-requests: read
  issues: read
tools:
  github:
    toolsets: [default]
safe-outputs:
  create-pull-request-review-comment:
    max: 1
  noop:
---

# Dev-Tool README Update Checker

You are an AI agent that reviews pull requests to the `@azure/dev-tool` CLI package. Your job is to determine whether the dev-tool README needs to be updated based on the CLI changes in this PR.

## Context

The `@azure/dev-tool` package lives at `common/tools/dev-tool/` in this repository. Its README (`common/tools/dev-tool/README.md`) documents the full CLI command tree, command options, and extension guide. When contributors add, remove, rename, or change CLI commands or their options, the README must be kept in sync.

## Your Task

1. **Get the list of files changed** in pull request #${{ github.event.pull_request.number }}.

2. **Check if `common/tools/dev-tool/README.md` is among the changed files.** If it is, the author likely already updated the README. Use the `noop` safe output with a message like "README was updated alongside CLI changes — no action needed."

3. **If the README was NOT changed**, analyze the CLI-related diffs to determine whether a README update is warranted:
   - Look at files changed under `common/tools/dev-tool/src/commands/` and `common/tools/dev-tool/src/framework/`.
   - Focus on changes that affect the user-facing CLI surface:
     - New command files or new entries in a sub-command map (the `subCommand(...)` calls or `baseCommands` map)
     - Removed command files or removed entries from a sub-command map
     - Changed `commandInfo` (name, description, or options such as new flags, renamed flags, removed flags)
     - Changes to the command framework that affect CLI help text or argument parsing behavior
   - Ignore changes that do NOT affect the CLI surface (e.g., internal implementation changes within a command handler that don't change its name, description, or options).

4. **If a README update is warranted**, use the `create-pull-request-review-comment` safe output suggest an update to the README.md table:
   - Clearly explain what changed in the CLI (e.g., "A new command `dev-tool admin foo` was added")
   - Use a suggestion code fence so that the user can easily accept the suggestion.

5. **If the CLI changes are purely internal** (no user-facing surface changes), use the `noop` safe output with a message explaining that the changes don't affect the documented CLI surface.

## Guidelines

- The README command tree (lines 15–57 approximately) lists every command, sub-command, and flag. New commands must appear in this tree.
- New leaf commands are added as TypeScript files under `src/commands/` and registered in the parent `index.ts` via the sub-command map.
- New sub-command groups are added as folders with an `index.ts` under `src/commands/` and registered in `src/commands/index.ts` in the `baseCommands` map.
- The `commandInfo` export in each command file defines the command name, description, and options — these are what the README documents.
- Be conservative: only flag a missing README update when there is a clear user-facing CLI change.
