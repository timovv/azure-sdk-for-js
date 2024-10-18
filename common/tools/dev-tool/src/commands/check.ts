// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License

import path from "node:path";
import { resolveProject } from "../util/resolveProject";
import { createPrinter } from "../util/printer";
import { leafCommand } from "../framework/command";
import { makeCommandInfo } from "../framework/command";
import fs from "node:fs/promises";
import { Check, isCheckFailedError } from "../framework/check";

const log = createPrinter("check");

export const commandInfo = makeCommandInfo("check", "run package checks", {
  fix: {
    kind: "boolean",
    description: "attempt to fix failing checks, where supported",
    default: false,
  },
  release: {
    kind: "boolean",
    description: "run pre-release checks",
    default: false,
  },
  verbose: {
    kind: "boolean",
    shortName: "v",
    description: "show output of check commands",
    default: false,
  },
});

export default leafCommand(commandInfo, async (options) => {
  const checkFileNames = await fs.readdir(path.join(__dirname, "..", "checks"));

  log.info("Running checks");

  for (const checkFile of checkFileNames) {
    const checks = (await import(path.posix.join("../checks", checkFile))) as Record<string, Check>;
    log("@azure/dev-tool", checkFile);
    for (const [exportName, check] of Object.entries(checks)) {
      if (check.tags?.includes("release") && !options.release) {
        // skip release checks
        continue;
      }

      const name = check.name ?? exportName;
      try {
        await check.check({
          fix: options.fix,
          verbose: options.verbose,
          project: await resolveProject(),
        });
        log(`  ✅ ${name}`);
      } catch (e: unknown) {
        log(`  ❌ ${name} - ${(e as any).message}`);
        if (isCheckFailedError(e) && e.detail) {
          e.detail
            .split("\n")
            .map((x) => `  > ${x}`)
            .forEach((x) => log(x));
        }
      }
    }
  }

  return true;
});
