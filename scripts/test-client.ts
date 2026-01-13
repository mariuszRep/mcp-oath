import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHttpClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function main() {
    const url = process.argv[2] || "http://localhost:3000/api/mcp";
    const token = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!token) {
        console.error("Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment.");
        console.error("Please run this script with `dotenv` or ensure .env.local is loaded.");
        process.exit(1);
    }

    console.log(`Connecting to ${url}...`);

    // The client transport connects via the Streamable HTTP protocol
    const transport = new StreamableHttpClientTransport({
        endpoint: url,
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    const client = new Client(
        {
            name: "test-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log("✅ Connected successfully!");

        console.log("Listing tools...");
        const tools = await client.listTools();
        console.log("Tools found:", tools.tools.map(t => t.name).join(", "));

        console.log("Calling 'hello-world' tool...");
        const result = await client.callTool({
            name: "hello-world",
            arguments: { name: "Test User" },
        });

        console.log("Result:", JSON.stringify(result, null, 2));

        // Clean exit
        await client.close();
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

main();
