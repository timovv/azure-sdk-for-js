import { parse as parseYAML } from "yaml";
import { Project } from "ts-morph";
import fs from "fs-extra";
import path from "path";
import { resolveProject } from "../resolveProject";

import { EXPORTS_YML, ExportsConfiguration } from "./common";
import { emitExportsFile } from "./emit";

async function readExportsYml(): Promise<ExportsConfiguration> {
  return parseYAML(
    await fs.readFile(path.join(process.cwd(), EXPORTS_YML), "utf-8")
  ) as ExportsConfiguration;
}

export async function makeExports(): Promise<void> {
  const exportsYml = await readExportsYml();
  const project = await resolveProject();
  const tsMorphProject = new Project({
    tsConfigFilePath: path.join(project.path, "tsconfig.json"),
  });

  // Clean
  for (const file of exportsYml.exports) {
    tsMorphProject.getSourceFile(file.outputPath)?.deleteImmediately();
  }

  for (const file of exportsYml.exports) {
    await emitExportsFile(tsMorphProject, exportsYml.esm ?? false, file);
  }

  await tsMorphProject.emit();
  await tsMorphProject.save();
}
