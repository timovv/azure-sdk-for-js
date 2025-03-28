// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PerfTest } from "@azure-tools/test-perf";
import { LogsQueryClient } from "@azure/monitor-query";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

export abstract class MonitorQueryLog<TOptions> extends PerfTest<TOptions> {
  client: LogsQueryClient;

  constructor() {
    super();
    const tokenCredential = new DefaultAzureCredential();
    this.client = new LogsQueryClient(tokenCredential);
  }
}
