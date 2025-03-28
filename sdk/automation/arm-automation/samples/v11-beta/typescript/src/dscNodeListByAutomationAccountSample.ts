/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */
import {
  DscNodeListByAutomationAccountOptionalParams,
  AutomationClient
} from "@azure/arm-automation";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listAllDscNodesByAutomationAccount.json
 */
async function listDscNodesByAutomationAccount() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listPagedDscNodesByAutomationAccountWithNodeConfigurationNotAssignedFilter.json
 */
async function listPagedDscNodesByAutomationAccountWhereNodeConfigurationsAreNotAssignedFilter() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const filter = "properties/nodeConfiguration/name eq ''";
  const skip = 0;
  const top = 20;
  const inlinecount = "allpages";
  const options: DscNodeListByAutomationAccountOptionalParams = {
    filter,
    skip,
    top,
    inlinecount
  };
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName,
    options
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listPagedDscNodesByAutomationAccountWithNodeConfigurationCustomFilter.json
 */
async function listPagedDscNodesByAutomationAccountWithNodeConfigurationCustomFilter() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const filter =
    "contains(properties/nodeConfiguration/name,'SetupServer.localhost,SetupClient.localhost,$$Not$$Configured$$')";
  const skip = 0;
  const top = 4;
  const inlinecount = "allpages";
  const options: DscNodeListByAutomationAccountOptionalParams = {
    filter,
    skip,
    top,
    inlinecount
  };
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName,
    options
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listPagedDscNodesByAutomationAccountWithNameFilter.json
 */
async function listPagedDscNodesByAutomationAccountWithNameFilter() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const filter = "contains('DSCCOMP',name)";
  const skip = 0;
  const top = 6;
  const inlinecount = "allpages";
  const options: DscNodeListByAutomationAccountOptionalParams = {
    filter,
    skip,
    top,
    inlinecount
  };
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName,
    options
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listPagedDscNodesByAutomationAccountWithNoFilter.json
 */
async function listPagedDscNodesByAutomationAccountWithNoFilters() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const skip = 0;
  const top = 2;
  const inlinecount = "allpages";
  const options: DscNodeListByAutomationAccountOptionalParams = {
    skip,
    top,
    inlinecount
  };
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName,
    options
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listPagedDscNodesByAutomationAccountWithStatusFilter.json
 */
async function listPagedDscNodesByAutomationAccountWithNodeStatusFilter() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const filter = "contains(properties/status,'Compliant,NotCompliant')";
  const skip = 0;
  const top = 4;
  const inlinecount = "allpages";
  const options: DscNodeListByAutomationAccountOptionalParams = {
    filter,
    skip,
    top,
    inlinecount
  };
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName,
    options
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listPagedDscNodesByAutomationAccountWithVersionFilter.json
 */
async function listPagedDscNodesByAutomationAccountWithVersionFilter() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const filter = "properties/extensionHandler/any(eh: eh/version le '2.70')";
  const skip = 0;
  const top = 4;
  const inlinecount = "allpages";
  const options: DscNodeListByAutomationAccountOptionalParams = {
    filter,
    skip,
    top,
    inlinecount
  };
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName,
    options
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

/**
 * This sample demonstrates how to Retrieve a list of dsc nodes.
 *
 * @summary Retrieve a list of dsc nodes.
 * x-ms-original-file: specification/automation/resource-manager/Microsoft.Automation/preview/2020-01-13-preview/examples/listPagedDscNodesByAutomationAccountWithCompositeFilter.json
 */
async function listPagedDscNodesWithFiltersSeparatedByAnd() {
  const subscriptionId = process.env["AUTOMATION_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["AUTOMATION_RESOURCE_GROUP"] || "rg";
  const automationAccountName = "myAutomationAccount33";
  const filter =
    "properties/extensionHandler/any(eh: eh/version gt '2.70') and contains(name,'sql') and contains(properties/nodeConfiguration/name,'$$Not$$Configured$$')";
  const skip = 0;
  const top = 10;
  const inlinecount = "allpages";
  const options: DscNodeListByAutomationAccountOptionalParams = {
    filter,
    skip,
    top,
    inlinecount
  };
  const credential = new DefaultAzureCredential();
  const client = new AutomationClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.dscNodeOperations.listByAutomationAccount(
    resourceGroupName,
    automationAccountName,
    options
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

async function main() {
  listDscNodesByAutomationAccount();
  listPagedDscNodesByAutomationAccountWhereNodeConfigurationsAreNotAssignedFilter();
  listPagedDscNodesByAutomationAccountWithNodeConfigurationCustomFilter();
  listPagedDscNodesByAutomationAccountWithNameFilter();
  listPagedDscNodesByAutomationAccountWithNoFilters();
  listPagedDscNodesByAutomationAccountWithNodeStatusFilter();
  listPagedDscNodesByAutomationAccountWithVersionFilter();
  listPagedDscNodesWithFiltersSeparatedByAnd();
}

main().catch(console.error);
