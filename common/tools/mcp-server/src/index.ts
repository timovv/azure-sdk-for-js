// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { helloWorldSchema, helloWorld } from "./tools/helloWorld.js";
import { compileProcess, compileProcessSchema } from "./tools/compileProcess.js";
import { registerTools } from "./release-prep.md.js";


const server = new McpServer({
  name: "Azure SDK MCP Server",
  version: "1.0.0-beta.1",
});

// Register a tool
server.tool("hello_world", "Prints hello world", helloWorldSchema.shape, (args) =>
  helloWorld(args),
);

server.tool("compile", "Compile a text prompt to TypeScript", compileProcessSchema.shape, args => compileProcess(args, server.server));

registerTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Server started");
}

main().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
