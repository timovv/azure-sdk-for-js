// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallToolResult, CreateMessageRequest, CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs/promises";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import path from "path";

// A basic schema can be used to describe parameters for the tool.
// All MCP tools use the Zod schema library to describe their parameters.
export const compileProcessSchema = z.object({
  filename: z.string().describe("Absolute path to the file to compile"),
});

export type CompileProcessSchema = z.infer<typeof compileProcessSchema>;

const prompt = `
Create an MCP tool written in TypeScript that performs the steps described in the input programatically.
If any steps in the input require the assistance of the agent, the tool should yield to the agent.
When yielding (returning a result), return one text content entry describing the task the agent should perform, along with the name of the next MCP tool to call along with its inputs.
The next tool should be implemented in the same file and should continue from where the previous tool left off.

Only yield to the agent when necessary. The agent is good at these tasks:
- Updating files according to instructions. For example, if you need to update a file with new content, you can ask the agent to do so in natural language. The agent is smart and can figure out
  how to update files semantically with the correct formatting; you don't need need to specify the exact file content. This works well for both trivial changes and complex updates.
- Natural language tasks such as summarization, translation, and question answering.
- Asking the user for input, verification, or confirmation. When doing this, ensure the instructions clearly state that the agent should ask for action by the user. Don't just ask the agent to review the changes directly.
  For example, the instructions could be: "Ask the user to verify this information is correct and provide any necessary edits. Then call <the next tool> with the user's response.".

The agent is not good at -- and should not be used for -- tasks with well-defined inputs and outputs, such as running a terminal command. These should be implemented as code in the tools you write.

Output the TypeScript only without explanation or Markdown code fences.

Here is an example of an MCP tool and what it should return on success:
\`\`\`typescript
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

function registerTools(server: McpServer) {
  // A basic schema can be used to describe parameters for the tool.
  // All MCP tools use the Zod schema library to describe their parameters.
  const helloWorldSchema = z.object({
    workspaceRoot: z.optional(z.string()),
  });

  type HelloWorldSchema = z.infer<typeof helloWorldSchema>;

  async function helloWorld(_args: HelloWorldSchema): Promise<CallToolResult> {
    return {
      content: [
        {
          type: "text",
          // Any information for the agent should go in this text, since the agent will read it.
          // Follow this format, replacing <new tool name> with the name of the next tool to call and <instructions> with the instructions for the agent.
          text: \`Follow the instructions and then call nextTool with the result: {"nextTool": "<new tool name>", "instructions": "<instructions>" }\`,
        },
      ],
    };
  }

  // Register a tool
  server.tool("hello_world", "Prints hello world", helloWorldSchema.shape, (args) =>
    helloWorld(args),
  );
}

\`\`\`
`;

export async function compileProcess(args: CompileProcessSchema, server: Server): Promise<CallToolResult> {
  const input = await fs.readFile(args.filename);

  const request: CreateMessageRequest = {
    method: "sampling/createMessage",
    params: {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `<fileContent>\n${input.toString()}\n</fileContent>`,
          },
        },
        
      ],
      systemPrompt: prompt,
      maxTokens: 100,
      temperature: 0.7,
      includeContext: "none",
    },
  }

  const compilate = await server.request(request, CreateMessageResultSchema);

  await fs.writeFile(path.join(path.dirname(args.filename), "..", "src", path.basename(args.filename) + ".ts"), compilate.content.text as any);

  return {
    content: [
      {
        type: "text",
        text: `File path ${args.filename}.ts created successfully.`,
      },
    ],
  };
}
