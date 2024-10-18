import path from "path";
import { check, Check, createScriptCheck } from "../framework/check";
import { run } from "../util/run";
import fs from "fs/promises";

export const installable: Check = {
  hasFix: false,
  description: "Checks if the package is installable",
  tags: ["release"],
  async check({ project }) {
    const { output: packFileName } = await run(`npm pack --quiet`, {
      cwd: project.path,
      captureOutput: true,
    });
    const packPath = path.join(project.path, packFileName.trim());
    const tmpDir = await fs.mkdtemp("dev-tool-check");
    await fs.writeFile(path.join(tmpDir, "package.json"), "{}");

    const { exitCode, output } = await run(["npm", "install", packPath], {
      cwd: tmpDir,
      captureOutput: true,
      captureExitCode: true,
    });
    await fs.rm(packPath);
    await fs.rm(tmpDir, { recursive: true, force: true });
    check(exitCode === 0, "Could not install the package", output);
  },
};

export const areTheTypesWrong = createScriptCheck({
  tags: ["release"],
  description: "attw must not display any errors",
  checkCommand: "npx --yes @arethetypeswrong/cli --pack .",
});
