// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MongoClusterManagementClient } from "@azure/arm-mongocluster";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * This sample demonstrates how to updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 *
 * @summary updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 * x-ms-original-file: 2024-07-01/MongoClusters_PatchDiskSize.json
 */
async function updatesTheDiskSizeOnAMongoClusterResource(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  const client = new MongoClusterManagementClient(credential, subscriptionId);
  const result = await client.mongoClusters.update("TestResourceGroup", "myMongoCluster", {
    properties: { storage: { sizeGb: 256 } },
  });
  console.log(result);
}

/**
 * This sample demonstrates how to updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 *
 * @summary updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 * x-ms-original-file: 2024-07-01/MongoClusters_PatchPrivateNetworkAccess.json
 */
async function disablesPublicNetworkAccessOnAMongoClusterResourceWithAPrivateEndpointConnection(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  const client = new MongoClusterManagementClient(credential, subscriptionId);
  const result = await client.mongoClusters.update("TestResourceGroup", "myMongoCluster", {
    properties: { publicNetworkAccess: "Disabled" },
  });
  console.log(result);
}

/**
 * This sample demonstrates how to updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 *
 * @summary updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 * x-ms-original-file: 2024-07-01/MongoClusters_ResetPassword.json
 */
async function resetsTheAdministratorLoginPassword(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  const client = new MongoClusterManagementClient(credential, subscriptionId);
  const result = await client.mongoClusters.update("TestResourceGroup", "myMongoCluster", {
    properties: {
      administrator: { userName: "mongoAdmin", password: "password" },
    },
  });
  console.log(result);
}

/**
 * This sample demonstrates how to updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 *
 * @summary updates an existing mongo cluster. The request body can contain one to many of the properties present in the normal mongo cluster definition.
 * x-ms-original-file: 2024-07-01/MongoClusters_Update.json
 */
async function updatesAMongoClusterResource(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  const client = new MongoClusterManagementClient(credential, subscriptionId);
  const result = await client.mongoClusters.update("TestResourceGroup", "myMongoCluster", {
    properties: {
      administrator: { userName: "mongoAdmin" },
      serverVersion: "5.0",
      storage: { sizeGb: 256 },
      compute: { tier: "M50" },
      sharding: { shardCount: 4 },
      highAvailability: { targetMode: "SameZone" },
      previewFeatures: [],
      publicNetworkAccess: "Enabled",
    },
  });
  console.log(result);
}

async function main(): Promise<void> {
  updatesTheDiskSizeOnAMongoClusterResource();
  disablesPublicNetworkAccessOnAMongoClusterResourceWithAPrivateEndpointConnection();
  resetsTheAdministratorLoginPassword();
  updatesAMongoClusterResource();
}

main().catch(console.error);
