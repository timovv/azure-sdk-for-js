import path from "path";
import { createPackageJsonCheck } from "../framework/check";
import { resolveRoot } from "../util/resolveProject";

export const license = createPackageJsonCheck({
  description: 'License field in package.json must be set to "MIT"',
  hasFix: true,
  async check({ packageJson }) {
    packageJson.license = "MIT";
  },
});

export const homepage = createPackageJsonCheck({
  description: "Homepage must be the URL to the package README",
  hasFix: true,
  async check({ project, packageJson }) {
    const root = await resolveRoot();
    const p = path.relative(root, path.join(project.path, "README.md"));
    packageJson.homepage = `https://github.com/Azure/azure-sdk-for-js/blob/main/${p}`;
  },
});
