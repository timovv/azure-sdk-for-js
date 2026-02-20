// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License

import { leafCommand, makeCommandInfo } from "../framework/command";

export const commandInfo = makeCommandInfo("hello-world", "print a hello world message");

export default leafCommand(commandInfo, async () => {
  console.log("Hello world!");
  return true;
});
