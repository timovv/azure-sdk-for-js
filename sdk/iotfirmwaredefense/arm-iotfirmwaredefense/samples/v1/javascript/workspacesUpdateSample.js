/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { IoTFirmwareDefenseClient } = require("@azure/arm-iotfirmwaredefense");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

/**
 * This sample demonstrates how to The operation to update a firmware analysis workspaces.
 *
 * @summary The operation to update a firmware analysis workspaces.
 * x-ms-original-file: specification/fist/resource-manager/Microsoft.IoTFirmwareDefense/stable/2024-01-10/examples/Workspaces_Update_MaximumSet_Gen.json
 */
async function workspacesUpdateMaximumSetGen() {
  const subscriptionId =
    process.env["IOTFIRMWAREDEFENSE_SUBSCRIPTION_ID"] || "5443A01A-5242-4950-AC1A-2DD362180254";
  const resourceGroupName = process.env["IOTFIRMWAREDEFENSE_RESOURCE_GROUP"] || "rgworkspaces";
  const workspaceName = "E___-3";
  const workspace = { properties: {} };
  const credential = new DefaultAzureCredential();
  const client = new IoTFirmwareDefenseClient(credential, subscriptionId);
  const result = await client.workspaces.update(resourceGroupName, workspaceName, workspace);
  console.log(result);
}

/**
 * This sample demonstrates how to The operation to update a firmware analysis workspaces.
 *
 * @summary The operation to update a firmware analysis workspaces.
 * x-ms-original-file: specification/fist/resource-manager/Microsoft.IoTFirmwareDefense/stable/2024-01-10/examples/Workspaces_Update_MinimumSet_Gen.json
 */
async function workspacesUpdateMinimumSetGen() {
  const subscriptionId =
    process.env["IOTFIRMWAREDEFENSE_SUBSCRIPTION_ID"] || "5443A01A-5242-4950-AC1A-2DD362180254";
  const resourceGroupName = process.env["IOTFIRMWAREDEFENSE_RESOURCE_GROUP"] || "rgworkspaces";
  const workspaceName = "E___-3";
  const workspace = {};
  const credential = new DefaultAzureCredential();
  const client = new IoTFirmwareDefenseClient(credential, subscriptionId);
  const result = await client.workspaces.update(resourceGroupName, workspaceName, workspace);
  console.log(result);
}

async function main() {
  workspacesUpdateMaximumSetGen();
  workspacesUpdateMinimumSetGen();
}

main().catch(console.error);
