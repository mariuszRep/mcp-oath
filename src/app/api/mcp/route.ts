import { createMcpHandler, experimental_withMcpAuth } from "@vercel/mcp-adapter";
import { initializeMcpServer } from "@/lib/mcp";
import { validateSupabaseToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

const mcpHandler = createMcpHandler(initializeMcpServer, {
    serverInfo: {
        name: "mcp-oath",
        version: "1.0.0",
    },
});

// Wrap with Authentication
// This handles the Bearer token processing and context injection
const protectedHandler = experimental_withMcpAuth(
    mcpHandler,
    async (req, token) => {
        if (!token) return undefined; // No token = Unauthorized
        return validateSupabaseToken(token);
    },
    {
        required: true,
        // Support OAuth 2.1 Resource discovery
        resourceMetadataPath: "/api/oauth-metadata",
    }
);

export async function POST(req: Request) {
    return protectedHandler(req);
}

export async function GET(req: Request) {
    return protectedHandler(req);
}
