// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SpawnOptions, spawn } from "node:child_process";
import os from "node:os";
import { createPrinter } from "./printer";

export interface RunOptions extends SpawnOptions {
  captureOutput?: boolean;

  /**
   * By default a non-zero exit code will cause an exception to be thrown.
   * Set this option to true to not throw in this case.
   */
  captureExitCode?: boolean;
}

export interface RunResult {
  exitCode: number;
}

export interface RunResultWithOutput extends RunResult {
  output: string;
}

export function escapeWin32Arg(arg: string): string {
  // https://flatt.tech/research/posts/batbadbut-you-cant-securely-execute-commands-on-windows/

  // 1. replace % with some wacky substitution to prevent variable expansion (see link above for details)
  let escaped = arg.replaceAll("%", "%%cd:~,%")
  // 2. if a double quote is preceded by a backslash, escape the backslash with another backslash
  escaped = escaped.replaceAll('\\"', '\\\\"');
  // 3. escape all double quotes by doubling them
  escaped = escaped.replaceAll('"', '""');
  // 4. remove newlines to prevent command injection
  escaped = escaped.replaceAll("\n", "");
  // 5. surround the whole thing in quotes.
  return `"${escaped}"`;
}

const log = createPrinter("run");

/**
 * Run the given command as a child process.
 *
 * @param command - the command to run. If an array of strings is passed, the first element will be the executable to run and the remaining elements will be the arguments. If a string is passed, it will be split on space (' ') and
 *                  then treated the same as a string array (quoting etc will not work for escaping).
 */
export async function run(command: string[] | string): Promise<RunResult>;

/**
 * Run the given command as a child process.
 *
 * @param command - the command to run. If an array of strings is passed, the first element will be the executable to run and the remaining elements will be the arguments. If a string is passed, it will be split on space (' ') and
 *                  then treated the same as a string array (quoting etc will not work for escaping).
 * @param options - options passed to `spawn`, plus additional options: if `captureOutput` is true, the output of the command will be returned as a string.
 */
export async function run(
  command: string[] | string,
  options: RunOptions & { captureOutput: true },
): Promise<RunResultWithOutput>;

/**
 * Run the given command as a child process.
 *
 * @param command - the command to run. If an array of strings is passed, the first element will be the executable to run and the remaining elements will be the arguments. If a string is passed, it will be split on space (' ') and
 *                  then treated the same as a string array (quoting etc will not work for escaping).
 * @param options - options passed to `spawn`, plus additional options: if `captureOutput` is false, output will not be captured and returned.
 */
export async function run(
  command: string[] | string,
  options: RunOptions & { captureOutput?: false },
): Promise<RunResult>;

export async function run(
  command: string[] | string,
  options: RunOptions = {},
): Promise<RunResult | RunResultWithOutput> {
  const [executable, ...argv] = typeof command === "string" ? command.split(" ") : command;

  let output = "";

  const exitCode = await new Promise<number>((resolve, reject) => {
    console.log(argv);
    console.log(argv.map(escapeWin32Arg).join(" "));
    const proc = os.platform() === "win32" ? spawn("cmd.exe", ["/V:OFF", "/E:ON", "/C", [executable, ...argv.map(escapeWin32Arg)].join(' ')]) : spawn(executable, argv, options);
    log.debug(`Running command: ${[executable, ...argv].join(" ")}`);

    proc.stderr?.setEncoding("utf8");
    proc.on("exit", (exitCode, signal) => {
      if (exitCode === null) {
        if (output) {
          log.warn(output);
        }
        reject(new Error(`subprocess exited with signal ${signal}`));
      } else {
        resolve(exitCode);
      }
    });

    proc.on("error", reject);

    if (options.captureOutput) {
      proc.stdout?.on("data", (data) => {
        output += data;
      });
      proc.stderr?.on("data", (data) => {
        output += data;
      });
    }
  });

  if (!options.captureExitCode && exitCode !== 0) {
    if (output) {
      log.warn(output);
    }
    throw new Error(`Process exited with exit code ${exitCode}`);
  }

  if (exitCode !== 0 && output) {
    log.warn(output);
  }
  return { output, exitCode };
}
