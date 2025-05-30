/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */
import { CustomerInsightsManagementClient } from "@azure/arm-customerinsights";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * This sample demonstrates how to Deletes a Prediction in the hub.
 *
 * @summary Deletes a Prediction in the hub.
 * x-ms-original-file: specification/customer-insights/resource-manager/Microsoft.CustomerInsights/stable/2017-04-26/examples/PredictionsDelete.json
 */
async function predictionsDelete(): Promise<void> {
  const subscriptionId = "c909e979-ef71-4def-a970-bc7c154db8c5";
  const resourceGroupName = "TestHubRG";
  const hubName = "sdkTestHub";
  const predictionName = "sdktest";
  const credential = new DefaultAzureCredential();
  const client = new CustomerInsightsManagementClient(
    credential,
    subscriptionId
  );
  const result = await client.predictions.beginDeleteAndWait(
    resourceGroupName,
    hubName,
    predictionName
  );
  console.log(result);
}

predictionsDelete().catch(console.error);
