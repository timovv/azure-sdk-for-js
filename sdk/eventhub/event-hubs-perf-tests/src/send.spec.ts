// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PerfOptionDictionary } from "@azure-tools/test-perf";
import { getEnvVar, BatchPerfTest } from "@azure-tools/test-perf";
import type { EventData } from "@azure/event-hubs";
import { EventHubProducerClient } from "@azure/event-hubs";
import "dotenv/config";

interface SendTestOptions {
  eventBodySize: number;
  numberOfEvents: number;
}

const connectionString = getEnvVar("EVENTHUB_CONNECTION_STRING");
const eventHubName = getEnvVar("EVENTHUB_NAME");

const producer = new EventHubProducerClient(connectionString, eventHubName);
export class SendTest extends BatchPerfTest<SendTestOptions> {
  producer: EventHubProducerClient;
  eventBatch: EventData[];
  public options: PerfOptionDictionary<SendTestOptions> = {
    eventBodySize: {
      required: true,
      description: "Size in bytes",
      shortName: "sz",
      longName: "event-size",
      defaultValue: 1024,
    },
    numberOfEvents: {
      required: true,
      description: "Number of events per send",
      shortName: "num",
      longName: "batch-size",
      defaultValue: 10,
    },
  };

  constructor() {
    super();
    this.producer = producer;
    const event = {
      body: Buffer.alloc(this.parsedOptions.eventBodySize.value!),
    };
    this.eventBatch = new Array(this.parsedOptions.numberOfEvents.value!).fill(event);
  }

  public async globalCleanup(): Promise<void> {
    await this.producer.close();
  }

  async runBatch(): Promise<number> {
    await this.producer.sendBatch(this.eventBatch);
    return this.eventBatch.length;
  }
}
