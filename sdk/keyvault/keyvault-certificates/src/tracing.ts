// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createTracingClient } from "@azure/core-tracing";
import { SDK_VERSION } from "./constants.js";

export const tracingClient = createTracingClient({
  namespace: "Microsoft.KeyVault",
  packageName: "@azure/keyvault-certificates",
  packageVersion: SDK_VERSION,
});
