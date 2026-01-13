import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export async function initializeMcpServer(server: McpServer) {
    server.tool(
        "hello-world",
        { name: z.string().optional() },
        async ({ name }) => {
            return {
                content: [
                    {
                        type: "text",
                        text: `Hello, ${name || "World"}!`,
                    },
                ],
            };
        }
    );

    // Add more tools here as needed
}
