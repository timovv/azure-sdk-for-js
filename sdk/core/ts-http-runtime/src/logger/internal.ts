import debug from "./debug.js";
import { Debugger, TypeSpecRuntimeClientLogger, TypeSpecRuntimeLogger, TypeSpecRuntimeLogLevel } from "./index.js";

export { Debugger, TypeSpecRuntimeClientLogger, TypeSpecRuntimeLogger, TypeSpecRuntimeLogLevel };

export interface __LoggingContext {
  setLogLevel(logLevel?: TypeSpecRuntimeLogLevel): void;
  getLogLevel(): TypeSpecRuntimeLogLevel | undefined;
  createClientLogger(namespace: string): TypeSpecRuntimeLogger;
  logger: TypeSpecRuntimeClientLogger;
}

export interface __CreateLoggingContextOptions {
  logLevelEnvVarName: string;
  namespace: string;
}

const TYPESPEC_RUNTIME_LOG_LEVELS = ["verbose", "info", "warning", "error"];

type TypeSpecRuntimeDebugger = Debugger & { level: TypeSpecRuntimeLogLevel };

export function __createLoggingContext(options: __CreateLoggingContextOptions): __LoggingContext {
  const registeredLoggers = new Set<TypeSpecRuntimeDebugger>();
  const logLevelFromEnv =
    (typeof process !== "undefined" && process.env && process.env[options.logLevelEnvVarName]) ||
    undefined;

  let logLevel: TypeSpecRuntimeLogLevel | undefined;

  /**
   * The TypeSpecRuntimeLogger provides a mechanism for overriding where logs are output to.
   * By default, logs are sent to stderr.
   * Override the `log` method to redirect logs to another location.
   */
  const logger: TypeSpecRuntimeClientLogger = debug(options.namespace);
  logger.log = (...args) => {
    debug.log(...args);
  };

  if (logLevelFromEnv) {
    // avoid calling setLogLevel because we don't want a mis-set environment variable to crash
    if (isTypeSpecRuntimeLogLevel(logLevelFromEnv)) {
      setLogLevel(logLevelFromEnv);
    } else {
      console.error(
        `TYPESPEC_RUNTIME_LOG_LEVEL set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(
          ", ",
        )}.`,
      );
    }
  }

  /**
   * Immediately enables logging at the specified log level. If no level is specified, logging is disabled.
   * @param level - The log level to enable for logging.
   * Options from most verbose to least verbose are:
   * - verbose
   * - info
   * - warning
   * - error
   */
  function setLogLevel(level?: TypeSpecRuntimeLogLevel): void {
    if (level && !isTypeSpecRuntimeLogLevel(level)) {
      throw new Error(
        `Unknown log level '${level}'. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(",")}`,
      );
    }
    logLevel = level;

    const enabledNamespaces = [];
    for (const logger of registeredLoggers) {
      if (shouldEnable(logger)) {
        enabledNamespaces.push(logger.namespace);
      }
    }

    debug.enable(enabledNamespaces.join(","));
  }

  const levelMap = {
    verbose: 400,
    info: 300,
    warning: 200,
    error: 100,
  };

  function shouldEnable(logger: TypeSpecRuntimeDebugger): boolean {
    return Boolean(logLevel && levelMap[logger.level] <= levelMap[logLevel]);
  }

  /**
   * Retrieves the currently specified log level.
   */
  function getLogLevel(): TypeSpecRuntimeLogLevel | undefined {
    return logLevel;
  }

  /**
   * Creates a logger for use by the SDKs that inherits from `TypeSpecRuntimeLogger`.
   * @param namespace - The name of the SDK package.
   * @hidden
   */
  function createClientLogger(namespace: string): TypeSpecRuntimeLogger {
    const clientRootLogger: TypeSpecRuntimeClientLogger = logger.extend(namespace);
    patchLogMethod(logger, clientRootLogger);
    return {
      error: createLogger(clientRootLogger, "error"),
      warning: createLogger(clientRootLogger, "warning"),
      info: createLogger(clientRootLogger, "info"),
      verbose: createLogger(clientRootLogger, "verbose"),
    };
  }

  function patchLogMethod(
    parent: TypeSpecRuntimeClientLogger,
    child: TypeSpecRuntimeClientLogger | TypeSpecRuntimeDebugger,
  ): void {
    child.log = (...args) => {
      parent.log(...args);
    };
  }

  function createLogger(
    parent: TypeSpecRuntimeClientLogger,
    level: TypeSpecRuntimeLogLevel,
  ): TypeSpecRuntimeDebugger {
    const logger: TypeSpecRuntimeDebugger = Object.assign(parent.extend(level), {
      level,
    });

    patchLogMethod(parent, logger);

    if (shouldEnable(logger)) {
      const enabledNamespaces = debug.disable();
      debug.enable(enabledNamespaces + "," + logger.namespace);
    }

    registeredLoggers.add(logger);

    return logger;
  }

  function isTypeSpecRuntimeLogLevel(logLevel: string): logLevel is TypeSpecRuntimeLogLevel {
    return TYPESPEC_RUNTIME_LOG_LEVELS.includes(logLevel as any);
  }

  return {
    setLogLevel,
    getLogLevel,
    createClientLogger,
    logger,
  };
}
