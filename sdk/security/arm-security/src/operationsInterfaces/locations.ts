/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import {
  AscLocation,
  LocationsListOptionalParams,
  LocationsGetOptionalParams,
  LocationsGetResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Locations. */
export interface Locations {
  /**
   * The location of the responsible ASC of the specific subscription (home region). For each
   * subscription there is only one responsible location. The location in the response should be used to
   * read or write other resources in ASC according to their ID.
   * @param options The options parameters.
   */
  list(
    options?: LocationsListOptionalParams,
  ): PagedAsyncIterableIterator<AscLocation>;
  /**
   * Details of a specific location
   * @param ascLocation The location where ASC stores the data of the subscription. can be retrieved from
   *                    Get locations
   * @param options The options parameters.
   */
  get(
    ascLocation: string,
    options?: LocationsGetOptionalParams,
  ): Promise<LocationsGetResponse>;
}
