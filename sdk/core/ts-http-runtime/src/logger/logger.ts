import { TypeSpecRuntimeClientLogger, TypeSpecRuntimeLogger, TypeSpecRuntimeLogLevel } from "./index.js";
import { __createLoggingContext } from "./internal.js";

const context = __createLoggingContext({
  logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
  namespace: "typeSpecRuntime",
});

export const logger: TypeSpecRuntimeClientLogger = context.logger;

export function setLogLevel(logLevel: TypeSpecRuntimeLogLevel): void {
  context.setLogLevel(logLevel);
}

export function createClientLogger(namespace: string): TypeSpecRuntimeLogger {
  return context.createClientLogger(namespace);
}
