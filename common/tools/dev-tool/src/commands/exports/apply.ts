// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license

import { createPrinter } from "../../util/printer";
import { makeExports } from "../../util/exporter";
import { leafCommand, makeCommandInfo } from "../../framework/command";

const log = createPrinter("apply-exports");

export const commandInfo = makeCommandInfo("apply", "applies exports to the SDK", {});

export default leafCommand(commandInfo, async () => {
  log(`Building exports`);
  makeExports();
  return true;
});
