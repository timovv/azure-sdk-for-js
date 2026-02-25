// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createGenerated, GeneratedContext, GeneratedClientOptionalParams } from "./api/index.js";
import { ServiceOperations, _getServiceOperations } from "./classic/service/index.js";
import { TableOperations, _getTableOperations } from "./classic/table/index.js";
import { TokenCredential } from "@azure/core-auth";
import { Pipeline } from "@azure/core-rest-pipeline";

export { GeneratedClientOptionalParams } from "./api/generatedContext.js";

export class GeneratedClient {
  private _client: GeneratedContext;
  /** The pipeline used by this client to make requests */
  public readonly pipeline: Pipeline;

  constructor(
    endpointParam: string,
    credential?: TokenCredential,
    options: GeneratedClientOptionalParams = {},
  ) {
    const prefixFromOptions = options?.userAgentOptions?.userAgentPrefix;
    const userAgentPrefix = prefixFromOptions
      ? `${prefixFromOptions} azsdk-js-client`
      : `azsdk-js-client`;
    this._client = createGenerated(endpointParam, credential, {
      ...options,
      userAgentOptions: { userAgentPrefix },
    });
    this.pipeline = this._client.pipeline;
    this.service = _getServiceOperations(this._client);
    this.table = _getTableOperations(this._client);
  }

  /** The operation groups for service */
  public readonly service: ServiceOperations;
  /** The operation groups for table */
  public readonly table: TableOperations;
}
