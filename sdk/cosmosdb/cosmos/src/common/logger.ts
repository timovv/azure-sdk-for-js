// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { createClientLogger, AzureLogger } from "@azure/logger";

/**
 * The \@azure/logger configuration for this package.
 */
export const defaultLogger: AzureLogger = createClientLogger("cosmosdb");
