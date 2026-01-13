import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const handler = createMcpHandler(
    (server) => {
        server.registerTool(
            "hello_world",
            {
                title: "Hello World",
                description: "A simple hello world tool.",
                inputSchema: {
                    name: z.string().optional().describe("The name to greet."),
                },
            },
            async ({ name }, extra) => {
                const username = extra.authInfo?.clientId || "Anonymous";
                return {
                    content: [
                        {
                            type: "text",
                            text: `Hello, ${name || "world"}! You are logged in as ${username}.`,
                        },
                    ],
                };
            }
        );
    },
    {},
    {
        basePath: "/api",
        maxDuration: 60,
        verboseLogs: true,
    }
);

const verifyToken = async (
    req: Request,
    bearerToken?: string
): Promise<AuthInfo | undefined> => {
    if (!bearerToken) return undefined;

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(bearerToken);

    if (error || !user) {
        console.error("Token verification failed:", error);
        return undefined;
    }

    return {
        token: bearerToken,
        scopes: ["read:mcp"], // Adjust scopes if needed
        clientId: user.email || user.id,
        extra: { userId: user.id },
    };
};


const authHandler = withMcpAuth(handler, verifyToken, {
    required: true,
    requiredScopes: [], // Supabase Auth handles permissions via RLS usually, but we can enforce scopes here if encoded in token
    resourceMetadataPath: "/.well-known/oauth-protected-resource",
});

export { authHandler as GET, authHandler as POST };
