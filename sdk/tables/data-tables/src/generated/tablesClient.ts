// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createTables, TablesContext, TablesClientOptionalParams } from "./api/index.js";
import { ServiceOperations, _getServiceOperations } from "./classic/service/index.js";
import { TableOpsOperations, _getTableOpsOperations } from "./classic/tableOps/index.js";
import { Pipeline } from "@azure/core-rest-pipeline";

export { TablesClientOptionalParams } from "./api/tablesContext.js";

export class TablesClient {
  private _client: TablesContext;
  /** The pipeline used by this client to make requests */
  public readonly pipeline: Pipeline;

  constructor(endpointParam: string, options: TablesClientOptionalParams = {}) {
    const prefixFromOptions = options?.userAgentOptions?.userAgentPrefix;
    const userAgentPrefix = prefixFromOptions
      ? `${prefixFromOptions} azsdk-js-client`
      : `azsdk-js-client`;
    this._client = createTables(endpointParam, {
      ...options,
      userAgentOptions: { userAgentPrefix },
    });
    this.pipeline = this._client.pipeline;
    this.tableOps = _getTableOpsOperations(this._client);
    this.service = _getServiceOperations(this._client);
  }

  /** The operation groups for tableOps */
  public readonly tableOps: TableOpsOperations;
  /** The operation groups for service */
  public readonly service: ServiceOperations;
}
