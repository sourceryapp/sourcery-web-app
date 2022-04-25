import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.1"

export const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
)

export const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
)

export const jwtDecoder = (jwt:string) => {
    return JSON.parse(atob(jwt.split(".")[1]))
}

export const testJwtDecoder = (authHeader : string) => {
    const token = authHeader.replace("Bearer ", "")
    return jwtDecoder(token)
}

export const getRequestingUser = async (authHeader : string) => {
    supabaseClient.auth.setAuth(authHeader.replace("Bearer ", ""))
    const { data, error } = await supabaseClient
        .from("user")
        .select("*")

    if ( error ) {
        throw error
    }

    if ( data?.length === 1 ) {

    }
}