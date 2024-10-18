import path from "node:path";
import { format } from "../util/prettier";
import { ProjectInfo } from "../util/resolveProject";
import { run } from "../util/run";
import fs from "node:fs/promises";

export type CheckTags = "release";

export interface CheckInfo {
  /**
   * Name of the check
   *
   * If unspecified a name will be inferred from the export
   */
  name?: string;

  /**
   * Optional extended description of the check
   */
  description?: string;

  /**
   * True if the check can attempt to fix itself
   */
  hasFix: boolean;

  tags?: CheckTags[];
}

export interface CheckContext {
  /**
   * Whether to attempt to fix
   */
  fix: boolean;

  /**
   * Information about the project
   */
  project: ProjectInfo;

  /**
   * Whether to output verbosely
   */
  verbose: boolean;
}

export type CheckFunction = (ctx: CheckContext) => Promise<void>;

export interface Check extends CheckInfo {
  /**
   * Run the check in the given context
   */
  check: CheckFunction;
}

/**
 * Error indicating that a check has failed
 */
export class CheckFailedError extends Error {
  constructor(
    message: string,
    public detail?: string,
  ) {
    super(message);
    this.name = "CheckFailedError";
  }
}

export function isCheckFailedError(e: unknown): e is CheckFailedError {
  return (e as any)?.name === "CheckFailedError";
}

/**
 * Check that condition is true.
 * @param condition - condition to check
 * @param message - short message to display
 * @param detail - more details to display about the failure; can be multiple lines
 */
export function check(
  condition: boolean,
  message: string,
  detail?: string,
): asserts condition is true {
  if (!condition) {
    throw new CheckFailedError(message, detail);
  }
}

interface CreateScriptCheckOptions extends Omit<CheckInfo, "hasFix"> {
  /**
   * Command to be ran in order to run the check.
   *
   * If the command exits with a zero status code, that indicates the check is successful.
   * If the command exits with a non-zero status code, the output of the command will be reported
   * to provide details about the failure.
   */
  checkCommand: string;

  /**
   * Command to be ran to attempt to fix the check.
   * If undefined, this check will not be fixable.
   */
  fixCommand?: string;
}

/**
 * Create a check that runs a CLI command.
 *
 * @param options - options for creating the check, including the command to run, and, optionally, a command which can be run to attempt to fix the failing check.
 * @returns - the created check
 */
export function createScriptCheck(options: CreateScriptCheckOptions): Check {
  return {
    ...options,
    hasFix: Boolean(options.fixCommand),
    async check({ fix, project, verbose }) {
      if (fix) {
        check(options.fixCommand !== undefined, "fix command must be defined");
        const { exitCode, output } = await run(options.fixCommand!, {
          cwd: project.path,
          captureExitCode: true,
          stdio: verbose ? "inherit" : undefined,
          captureOutput: true,
        });
        check(exitCode === 0, `Check output exit code ${exitCode}`, output);
      } else {
        const { exitCode, output } = await run(options.checkCommand, {
          cwd: project.path,
          captureExitCode: true,
          stdio: verbose ? "inherit" : undefined,
          captureOutput: true,
        });
        check(exitCode === 0, `Check output exit code ${exitCode}`, output);
      }
    },
  };
}

/**
 * Context passed to the check() function of a package.json check.
 */
export interface PackageJsonCheckContext extends CheckContext {
  /**
   * JavaScript object representation of the project's package.json file.
   * This object may be mutated to cause check failures if the mutation results in a change, or to fix the check if in fix mode.
   */
  packageJson: PackageJson;
}

export interface PackageJsonCheckOptions extends CheckInfo {
  /**
   * Run the check. The package.json is provided as a JavaScript object at the top level of the context, `packageJson`.
   * This object may be mutated to cause check failures if the mutation results in a change, or to fix the check if in fix mode.
   * @param context - context the check is running in
   */
  check(context: PackageJsonCheckContext): Promise<void>;
}

/**
 * A check which validates properties of the package.json.
 * In addition to calling check(), the check function may mutate the input packageJson provided in the CheckContext. If it does this,
 * any material changes to the input packageJson will cause the check to fail, except if in fix mode (and the check has set allowFix to true). In
 * that case, the check will be fixed by writing the updated package.json to disk.
 *
 * @param options options - options for the check
 * @returns - the created check
 */
export function createPackageJsonCheck(options: PackageJsonCheckOptions): Check {
  return {
    ...options,
    async check({ fix, project, verbose }) {
      const { packageJson: originalPackageJson } = project;

      // The check may mutate the package.json
      const packageJsonClone = structuredClone(originalPackageJson);
      await options.check({
        verbose,
        packageJson: packageJsonClone,
        project: { ...project, packageJson: packageJsonClone },
        fix,
      });

      // Check if the cloned package JSON and original are different
      if (JSON.stringify(originalPackageJson) !== JSON.stringify(packageJsonClone)) {
        if (fix) {
          const newPackageJsonContent = await format(JSON.stringify(packageJsonClone), "json");
          await fs.writeFile(path.join(project.path, "package.json"), newPackageJsonContent);
        } else {
          check(false, options.description ?? "package.json changed unexpectedly");
        }
      }
    },
  };
}

/**
 * Check that running the given check command (with fix: true) or the given CLI command results in a clean working tree, i.e. no diff
 * Running this check in fix mode will run the check but will not check if it results in a clean working tree
 */
export function workingTreeUnchangedCheck(
  options: Omit<CheckInfo, "hasFix"> & ({ check: CheckFunction } | { fixCommand: string }),
): Check {
  const checkFunction: CheckFunction =
    ((options as any).check as CheckFunction) ??
    (async (ctx) => {
      const { output, exitCode } = await run((options as any).fixCommand, {
        captureOutput: true,
        captureExitCode: true,
        cwd: ctx.project.path,
      });
      check(exitCode === 0, `Command exited with exit code ${exitCode}`, output);
    });

  return {
    ...options,
    hasFix: true,
    async check({ fix, project, verbose }) {
      if (fix) {
        // Just run the command to fix
        await checkFunction({ fix: true, project, verbose });
        return;
      }

      // 1. Commit staged items (if none commit anyway)
      await run(
        [
          "git",
          "commit",
          "--allow-empty",
          "-m",
          String.raw`dev-tool temp commit of your work

dev-tool sincerely apologizes for not cleaning up after itself if this commit
is present in your commit history. If this is the latest commit,
you can clean up the mess it made by running "git reset HEAD^".`,
        ],
        { cwd: project.path },
      );
      // 2. Stage unstaged stuff
      await run("git add .", { cwd: project.path });

      // 3. Run the command
      await checkFunction({ fix: true, project, verbose });

      // 4. Check working tree is clean
      const { exitCode, output } = await run("git diff --exit-code .", {
        cwd: project.path,
        captureExitCode: true,
        captureOutput: true,
      });

      check(exitCode === 0, "Check resulted in a diff", output);

      // Undo changes to working tree
      await run("git checkout .", { cwd: project.path });
      // Undo staging of unstaged things
      await run("git reset .", { cwd: project.path });
      // Undo commit of staged things
      await run("git reset --soft HEAD~", { cwd: project.path });
    },
  };
}
