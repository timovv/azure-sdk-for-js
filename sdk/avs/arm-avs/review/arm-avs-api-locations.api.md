## API Report File for "@azure/arm-avs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Client } from '@azure-rest/core-client';
import { OperationOptions } from '@azure-rest/core-client';

// @public
export function checkQuotaAvailability(context: AzureVMwareSolutionAPIContext, location: string, options?: LocationsCheckQuotaAvailabilityOptionalParams): Promise<Quota>;

// @public
export function checkTrialAvailability(context: AzureVMwareSolutionAPIContext, location: string, options?: LocationsCheckTrialAvailabilityOptionalParams): Promise<Trial>;

// @public
export interface LocationsCheckQuotaAvailabilityOptionalParams extends OperationOptions {
}

// @public
export interface LocationsCheckTrialAvailabilityOptionalParams extends OperationOptions {
    sku?: Sku;
}

// (No @packageDocumentation comment for this package)

```
