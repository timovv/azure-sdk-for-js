// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export function registerTools(server: McpServer) {
  // Input schema for the main tool
  const releaseProcessSchema = z.object({
    packageDirectory: z.string(),
  });

  type ReleaseProcessSchema = z.infer<typeof releaseProcessSchema>;

  // Helper: Get most recently released version from CHANGELOG.md
  async function getMostRecentReleaseVersion(packageDirectory: string): Promise<{ version: string; date: string } | null> {
    const changelogPath = path.join(packageDirectory, "CHANGELOG.md");
    let changelog: string;
    try {
      changelog = await fs.readFile(changelogPath, "utf8");
    } catch {
      return null;
    }
    const lines = changelog.split("\n");
    for (const line of lines) {
      const match = line.match(/^##\s+([0-9]+\.[0-9]+\.[0-9]+)\s+\(([^)]+)\)/);
      if (match && match[2].toLowerCase() !== "unreleased") {
        return { version: match[1], date: match[2] };
      }
    }
    return null;
  }

  // Helper: Get package name from package.json
  async function getPackageName(packageDirectory: string): Promise<string> {
    const pkgPath = path.join(packageDirectory, "package.json");
    const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
    return pkg.name;
  }

  // Helper: Get diff since last release
  async function getGitDiff(packageDirectory: string, lastReleaseTag: string): Promise<string> {
    const srcPath = path.join(packageDirectory, "src");
    const { stdout } = await execAsync(
      `git --no-pager log ${lastReleaseTag}..HEAD -p ${srcPath}`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    return stdout;
  }

  // Main entry point
  async function releaseProcess(args: ReleaseProcessSchema): Promise<CallToolResult> {
    // Step 1: Get most recently released version
    const recent = await getMostRecentReleaseVersion(args.packageDirectory);
    if (!recent) {
      return {
        content: [
          {
            type: "text",
            text: `No previous release found in CHANGELOG.md. Ask the user to create an initial release entry, then call release_process again with the same input.`,
          },
        ],
      };
    }
    // Step 2: Get package name
    const packageName = await getPackageName(args.packageDirectory);
    // Step 3: Compute last release tag
    const lastReleaseTag = `${packageName}_${recent.version}`;
    // Step 4: Get git diff
    const diff = await getGitDiff(args.packageDirectory, lastReleaseTag);
    // Step 5: Summarize changes
    return {
      content: [
        {
          type: "text",
          text: `Summarize the following git diff into three categories: Features added, Bugs fixed, and Other changes. If there are no changes in a category, omit that category. Use bullet points for each item. Here is the diff:\n\n${diff}\n\nThen call verify_release_summary with your summary and the input: {"packageDirectory": "${args.packageDirectory}", "summary": "<your summary>"}`
        },
      ],
    };
  }

  // Schema for verify_release_summary
  const verifyReleaseSummarySchema = z.object({
    packageDirectory: z.string(),
    summary: z.string(),
  });

  type VerifyReleaseSummarySchema = z.infer<typeof verifyReleaseSummarySchema>;

  async function verifyReleaseSummary(args: VerifyReleaseSummarySchema): Promise<CallToolResult> {
    return {
      content: [
        {
          type: "text",
          text: `Ask the user to verify the following release summary and provide any necessary edits. If there are no changes to release, the user should indicate so. Once the user is satisfied, call handle_verified_summary with {"packageDirectory": "${args.packageDirectory}", "summary": "<user_edited_summary>"}. Here is the summary:\n\n${args.summary}`,
        },
      ],
    };
  }

  // Schema for handle_verified_summary
  const handleVerifiedSummarySchema = z.object({
    packageDirectory: z.string(),
    summary: z.string(),
  });

  type HandleVerifiedSummarySchema = z.infer<typeof handleVerifiedSummarySchema>;

  async function handleVerifiedSummary(args: HandleVerifiedSummarySchema): Promise<CallToolResult> {
    // If summary is empty or user says "no changes", skip to next package
    if (!args.summary.trim() || /^no changes/i.test(args.summary.trim())) {
      return {
        content: [
          {
            type: "text",
            text: `There are no changes needing a release. Continue to the next package if applicable.`,
          },
        ],
      };
    }
    // Otherwise, update the CHANGELOG
    return {
      content: [
        {
          type: "text",
          text: `Update the CHANGELOG.md in ${args.packageDirectory} to add or update the entry for the most recent version (should be marked as (Unreleased)), using the following summary:\n\n${args.summary}\n\n- If the headings for the current version already exist, update their content.\n- If any headings are empty, remove them.\n- Use the format:\n\n## <version> (Unreleased)\n\n### Features added\n- ...\n\n### Bugs fixed\n- ...\n\n### Other changes\n- ...\n\nOnce done, call set_release_date with {"packageDirectory": "${args.packageDirectory}"}.\n`,
        },
      ],
    };
  }

  // Schema for set_release_date
  const setReleaseDateSchema = z.object({
    packageDirectory: z.string(),
  });

  type SetReleaseDateSchema = z.infer<typeof setReleaseDateSchema>;

  async function setReleaseDate(args: SetReleaseDateSchema): Promise<CallToolResult> {
    // Read CHANGELOG.md, find the most recent (Unreleased) entry, and set its date to today
    const changelogPath = path.join(args.packageDirectory, "CHANGELOG.md");
    let changelog = await fs.readFile(changelogPath, "utf8");
    const today = new Date().toISOString().slice(0, 10);
    // Replace first occurrence of (Unreleased) with (YYYY-MM-DD)
    let replaced = false;
    changelog = changelog.replace(
      /^##\s+([0-9]+\.[0-9]+\.[0-9]+)\s+\(Unreleased\)/m,
      (match, version) => {
        replaced = true;
        return `## ${version} (${today})`;
      }
    );
    if (replaced) {
      await fs.writeFile(changelogPath, changelog, "utf8");
    }
    return {
      content: [
        {
          type: "text",
          text: `The release date has been set to today in CHANGELOG.md for the most recent version. The release process for this package is complete.`,
        },
      ],
    };
  }

  // Register all tools
  server.tool(
    "release_process",
    "Performs the release process for a package directory",
    releaseProcessSchema.shape,
    (args) => releaseProcess(args)
  );
  server.tool(
    "verify_release_summary",
    "Ask the user to verify and edit the release summary",
    verifyReleaseSummarySchema.shape,
    (args) => verifyReleaseSummary(args)
  );
  server.tool(
    "handle_verified_summary",
    "Handle the user-verified release summary and update the changelog",
    handleVerifiedSummarySchema.shape,
    (args) => handleVerifiedSummary(args)
  );
  server.tool(
    "set_release_date",
    "Set the release date for the most recent version in the changelog",
    setReleaseDateSchema.shape,
    (args) => setReleaseDate(args)
  );
}

export default registerTools;
