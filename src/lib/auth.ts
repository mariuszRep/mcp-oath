import { createClient } from "@supabase/supabase-js";

export async function validateSupabaseToken(token: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return undefined;
    }

    return {
        id: user.id,
        email: user.email,
        // Add any other user info you want to pass to the MCP context
    };
}
