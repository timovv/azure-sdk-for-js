import { leafCommand, makeCommandInfo } from "../../framework/command";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

export const commandInfo = makeCommandInfo("mcp", "start the Azure SDK for JS MCP server.");

export default leafCommand(commandInfo, async () => {
  const server = new McpServer({
    name: "azure-sdk-for-js dev-tool",
    version: "0.1.0",
  });

  // Add tools here
  // TODO better pattern for adding tools
  server.tool("echo", "replies with your message", { message: z.string() }, async ({ message }) => {
    return {
      content: [
        {
          type: "text",
          text: message,
        },
      ],
    };
  });

  await server.connect(new StdioServerTransport());

  return true;
});
