/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  PacketCoreControlPlaneCollectDiagnosticsPackage,
  MobileNetworkManagementClient,
} from "@azure/arm-mobilenetwork";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Collect a diagnostics package for the specified packet core control plane. This action will upload the diagnostics to a storage account.
 *
 * @summary Collect a diagnostics package for the specified packet core control plane. This action will upload the diagnostics to a storage account.
 * x-ms-original-file: specification/mobilenetwork/resource-manager/Microsoft.MobileNetwork/stable/2024-04-01/examples/PacketCoreControlPlaneCollectDiagnosticsPackage.json
 */
async function collectDiagnosticsPackageFromPacketCoreControlPlane(): Promise<void> {
  const subscriptionId =
    process.env["MOBILENETWORK_SUBSCRIPTION_ID"] ||
    "00000000-0000-0000-0000-000000000000";
  const resourceGroupName =
    process.env["MOBILENETWORK_RESOURCE_GROUP"] || "rg1";
  const packetCoreControlPlaneName = "TestPacketCoreCP";
  const parameters: PacketCoreControlPlaneCollectDiagnosticsPackage = {
    storageAccountBlobUrl:
      "https://contosoaccount.blob.core.windows.net/container/diagnosticsPackage.zip",
  };
  const credential = new DefaultAzureCredential();
  const client = new MobileNetworkManagementClient(credential, subscriptionId);
  const result =
    await client.packetCoreControlPlanes.beginCollectDiagnosticsPackageAndWait(
      resourceGroupName,
      packetCoreControlPlaneName,
      parameters,
    );
  console.log(result);
}

async function main(): Promise<void> {
  collectDiagnosticsPackageFromPacketCoreControlPlane();
}

main().catch(console.error);
