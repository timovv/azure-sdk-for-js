/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */
import type { PartialRegistryPartialTrackedResource } from "@azure/arm-machinelearning";
import { AzureMachineLearningServicesManagementClient } from "@azure/arm-machinelearning";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Update tags
 *
 * @summary Update tags
 * x-ms-original-file: specification/machinelearningservices/resource-manager/Microsoft.MachineLearningServices/stable/2024-04-01/examples/Registries/update-SystemCreated.json
 */
async function updateRegistryWithSystemCreatedAccounts(): Promise<void> {
  const subscriptionId =
    process.env["MACHINELEARNING_SUBSCRIPTION_ID"] || "00000000-1111-2222-3333-444444444444";
  const resourceGroupName = process.env["MACHINELEARNING_RESOURCE_GROUP"] || "test-rg";
  const registryName = "string";
  const body: PartialRegistryPartialTrackedResource = {
    identity: {
      type: "SystemAssigned",
      userAssignedIdentities: { string: {} },
    },
    sku: {
      name: "string",
      capacity: 1,
      family: "string",
      size: "string",
      tier: "Basic",
    },
    tags: {},
  };
  const credential = new DefaultAzureCredential();
  const client = new AzureMachineLearningServicesManagementClient(credential, subscriptionId);
  const result = await client.registries.update(resourceGroupName, registryName, body);
  console.log(result);
}

/**
 * This sample demonstrates how to Update tags
 *
 * @summary Update tags
 * x-ms-original-file: specification/machinelearningservices/resource-manager/Microsoft.MachineLearningServices/stable/2024-04-01/examples/Registries/update-UserCreated.json
 */
async function updateRegistryWithUserCreatedAccounts(): Promise<void> {
  const subscriptionId =
    process.env["MACHINELEARNING_SUBSCRIPTION_ID"] || "00000000-1111-2222-3333-444444444444";
  const resourceGroupName = process.env["MACHINELEARNING_RESOURCE_GROUP"] || "test-rg";
  const registryName = "string";
  const body: PartialRegistryPartialTrackedResource = {
    identity: { type: "UserAssigned", userAssignedIdentities: { string: {} } },
    sku: {
      name: "string",
      capacity: 1,
      family: "string",
      size: "string",
      tier: "Basic",
    },
    tags: {},
  };
  const credential = new DefaultAzureCredential();
  const client = new AzureMachineLearningServicesManagementClient(credential, subscriptionId);
  const result = await client.registries.update(resourceGroupName, registryName, body);
  console.log(result);
}

async function main(): Promise<void> {
  await updateRegistryWithSystemCreatedAccounts();
  await updateRegistryWithUserCreatedAccounts();
}

main().catch(console.error);
