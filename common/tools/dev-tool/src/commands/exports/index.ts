// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license

import { subCommand, makeCommandInfo } from "../../framework/command";

export const commandInfo = makeCommandInfo("exports", "builds exports");

export default subCommand(commandInfo, {
  apply: () => import("./apply"),
});
