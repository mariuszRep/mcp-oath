import { protectedResourceHandler } from "@vercel/mcp-adapter";

export const dynamic = "force-dynamic";

// Supabase Issuer URL typically looks like: https://<project-ref>.supabase.co/auth/v1
// But technically Supabase uses your project URL as the base for many things.
// The "issuer" in the Oauth metadata from `/.well-known/openid-configuration` is usually `https://<project-ref>.supabase.co/auth/v1`

const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We might need to append /auth/v1 depending on strictness of the issuer check by the client.
// Safest is to list the base URL + /auth/v1 just in case, or check Supabase docs for specific OIDC issuer value.
// Usually: ${SUPABASE_PROJECT_URL}/auth/v1
const ISSUER = `${SUPABASE_PROJECT_URL}/auth/v1`;

export const GET = protectedResourceHandler({
    authServerUrls: [ISSUER],
});
