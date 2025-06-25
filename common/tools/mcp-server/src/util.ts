// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CreateMessageRequest, CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export function requestSampling(server: Server, context: string, uri: string, maxTokens: number = 100): Promise<z.infer<typeof CreateMessageResultSchema>> {
  const request: CreateMessageRequest = {
    method: "sampling/createMessage",
    params: {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Resource ${uri} context: ${context}`,
          },
        },
      ],
      systemPrompt: "You are a helpful test server.",
      maxTokens,
      temperature: 0.7,
      includeContext: "thisServer",
    },
  };

  return server.request(request, CreateMessageResultSchema);
};
