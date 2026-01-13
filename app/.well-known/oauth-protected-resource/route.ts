import {
    protectedResourceHandler,
    metadataCorsOptionsRequestHandler,
} from "mcp-handler";

const handler = protectedResourceHandler({
    // This should be your Supabase project URL which hosts the Auth endpoints
    // e.g. https://<project-ref>.supabase.co
    authServerUrls: [process.env.NEXT_PUBLIC_SUPABASE_URL || ""],
});

const corsHandler = metadataCorsOptionsRequestHandler();

export { handler as GET, corsHandler as OPTIONS };
