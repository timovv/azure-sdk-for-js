/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import type { RecorderStartOptions } from "@azure-tools/test-recorder";
import { env, Recorder, delay, isPlaybackMode } from "@azure-tools/test-recorder";
import { createTestCredential } from "@azure-tools/test-credential";
import { RedisManagementClient } from "../src/redisManagementClient.js";
import type { VirtualNetwork } from "@azure/arm-network";
import { NetworkManagementClient } from "@azure/arm-network";
import { describe, it, assert, beforeEach, afterEach } from "vitest";

const replaceableVariables: Record<string, string> = {
  SUBSCRIPTION_ID: "88888888-8888-8888-8888-888888888888",
};

const recorderOptions: RecorderStartOptions = {
  envSetupForPlayback: replaceableVariables,
  removeCentralSanitizers: [
    "AZSDK3493", // .name in the body is not a secret and is listed below in the beforeEach section
    "AZSDK3430", // .id in the body is not a secret and is listed below in the beforeEach section
  ],
};

export const testPollingOptions = {
  updateIntervalInMs: isPlaybackMode() ? 0 : undefined,
};

describe("Redis test", () => {
  let recorder: Recorder;
  let subscriptionId: string;
  let client: RedisManagementClient;
  let network_client: NetworkManagementClient;
  let location: string;
  let resourceGroupName: string;
  let networkName: string;
  let subnetName: string;
  let name: string;

  beforeEach(async (ctx) => {
    recorder = new Recorder(ctx);
    await recorder.start(recorderOptions);
    subscriptionId = env.SUBSCRIPTION_ID || "";
    // This is an example of how the environment variables are used
    const credential = createTestCredential();
    client = new RedisManagementClient(
      credential,
      subscriptionId,
      recorder.configureClientOptions({}),
    );
    network_client = new NetworkManagementClient(
      credential,
      subscriptionId,
      recorder.configureClientOptions({}),
    );
    location = "eastus";
    resourceGroupName = "myjstest";
    networkName = "networknamex";
    subnetName = "subnetworknamex";
    name = "myrediscachexxx111";
  });

  afterEach(async () => {
    await recorder.stop();
  });

  async function createVirtualNetwork(
    localGroupName: string,
    localLocation: string,
    localNetworkName: string,
    localSubnetName: string,
  ): Promise<void> {
    const parameter: VirtualNetwork = {
      location: localLocation,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
    };
    // network create
    await network_client.virtualNetworks.beginCreateOrUpdateAndWait(
      localGroupName,
      localNetworkName,
      parameter,
      testPollingOptions,
    );
    // subnet create
    await network_client.subnets.beginCreateOrUpdateAndWait(
      localGroupName,
      localNetworkName,
      localSubnetName,
      { addressPrefix: "10.0.0.0/24" },
      testPollingOptions,
    );
  }

  it("operations list test", async () => {
    const resArray = new Array();
    for await (const item of client.operations.list()) {
      resArray.push(item);
    }
    assert.notEqual(resArray.length, 0);
  });

  it("Redis create test", async () => {
    // create network resource
    await createVirtualNetwork(resourceGroupName, location, networkName, subnetName);
    const res = await client.redis.beginCreateAndWait(
      resourceGroupName,
      name,
      {
        location: location,
        zones: ["1"],
        sku: {
          name: "Premium",
          family: "P",
          capacity: 1,
        },
        enableNonSslPort: true,
        shardCount: 2,
        redisConfiguration: {
          maxmemoryPolicy: "allkeys-lru",
        },
        subnetId:
          "/subscriptions/" +
          subscriptionId +
          "/resourceGroups/" +
          resourceGroupName +
          "/providers/Microsoft.Network/virtualNetworks/" +
          networkName +
          "/subnets/" +
          subnetName,
        staticIP: "10.0.0.5",
        minimumTlsVersion: "1.2",
      },
      testPollingOptions,
    );
    assert.equal(res.name, name);
  });

  it("redis get test", async () => {
    const res = await client.redis.get(resourceGroupName, name);
    assert.equal(res.name, name);
  });

  it("patchSchedules create for redis test", async () => {
    const res = await client.patchSchedules.createOrUpdate(resourceGroupName, name, "default", {
      scheduleEntries: [
        {
          dayOfWeek: "Monday",
          startHourUtc: 12,
          maintenanceWindow: "PT5H",
        },
        {
          dayOfWeek: "Tuesday",
          startHourUtc: 12,
        },
      ],
    });
    assert.equal(res.type, "Microsoft.Cache/Redis/PatchSchedules");
  });

  it("patchSchedules listByRedisResource for redis test", async () => {
    const resArray = new Array();
    for await (const item of client.patchSchedules.listByRedisResource(resourceGroupName, name)) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 1);
  });

  it("redis listByResourceGroup test", async () => {
    const resArray = new Array();
    for await (const item of client.redis.listByResourceGroup(resourceGroupName)) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 1);
  });

  it("redis update test", async () => {
    let count = 0;
    while (count < 20) {
      count++;
      const redisResponse = await client.redis.get(resourceGroupName, name);
      if (redisResponse.provisioningState === "Succeeded") {
        const updateResult = await client.redis.beginUpdateAndWait(
          resourceGroupName,
          name,
          { enableNonSslPort: true },
          testPollingOptions,
        );
        assert.equal(updateResult.enableNonSslPort, true);
        break;
      } else {
        // The resource is activating
        await delay(isPlaybackMode() ? 1000 : 300000);
      }
    }
  });

  it("patchSchedules delete for redis test", async () => {
    await client.patchSchedules.delete(resourceGroupName, name, "default");
    // It's can not run patchSchedules.listByRedisResource after patchSchedules.delete operation
  });

  it("redis delete test", async () => {
    await client.redis.beginDeleteAndWait(resourceGroupName, name, testPollingOptions);
    const resArray = new Array();
    for await (const item of client.redis.listByResourceGroup(resourceGroupName)) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 0);
  });
});
