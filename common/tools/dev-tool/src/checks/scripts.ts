import { createScriptCheck } from "../framework/check";

export const format = createScriptCheck({
  description: "Run format command",
  checkCommand: "npm run check-format",
  fixCommand: "npm run format",
});

export const lint = createScriptCheck({
  description: "Run lint command",
  checkCommand: "npm run lint",
  fixCommand: "npm run lint:fix",
});
