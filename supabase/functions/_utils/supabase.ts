import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.1"
import type { Message, MessageInsert, Organization, Request, User } from "./types.ts"

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

export const decodeAuthHeader = (authHeader : string) => {
    const token = authHeader.replace("Bearer ", "")
    return jwtDecoder(token)
}

export const getRequestingUser = async (authToken : string) => {
    supabaseClient.auth.setAuth(authToken)
    const { data, error } = await supabaseClient
        .from("user")
        .select("*")

    if ( error ) {
        throw error
    }

    if ( data?.length === 1 ) {
        return data[0]
    }
}

export const getLastMessageForUser = async (user_id : string) => {
    // supabaseClient.auth.setAuth(authHeader.replace("Bearer ", ""))
    const { data, error } = await supabaseAdmin
        .from<Message>("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .eq("to_user_id", user_id)
        .eq("sent", true)

    if ( error ) {
        throw error
    }

    if ( data.length > 0 ) {
        return data[0]
    }

    return null
}

export const getLastMessageByTypeForUser = async (user_id : string, template_name : string) => {
    const { data, error } = await supabaseAdmin
        .from<Message>("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .eq("to_user_id", user_id)
        .eq("template_name", template_name)
        .eq("sent", true)

    if ( error ) {
        throw error
    }

    if ( data.length > 0 ) {
        return data[0]
    }

    return null
}

export const createMessage = async (insertObj : MessageInsert) => {
    const { data, error } = await supabaseClient
        .from("messages")
        .insert([
            insertObj
        ])

    if ( error ) {
        throw error
    }

    return data
}

export const getRequest = async (authToken : string, request_id : string) => {
    supabaseClient.auth.setAuth(authToken)
    const { data, error } = await supabaseClient
        .from<Request>("requests")
        .select(`
            *,
            status!requests_status_id_fkey (*),
            repository:repositories (*),
            user!requests_user_id_fkey (*)
        `)
        .limit(1)
        .eq("id", request_id)
        .single()

    if ( error ) {
        throw error
    }

    if ( data ) {
        return data
    }

    return null
}

export const getOrganization = async (authToken : string, organization_id : string) => {
    supabaseClient.auth.setAuth(authToken)
    const { data, error } = await supabaseClient
        .from<Organization>("organizations")
        .select(`
            *,
            user:owner_id (*)
        `)
        .limit(1)
        .eq("id", organization_id)
        .single()

    if ( error ) {
        throw error
    }

    if ( data ) {
        return data
    }

    return null
}

export const getUser = async (authToken : string, user_id : string) => {
    supabaseClient.auth.setAuth(authToken)
    const { data, error } = await supabaseClient
        .from<User>("user")
        .select(`
            *
        `)
        .limit(1)
        .eq("id", user_id)
        .single()

    if ( error ) {
        throw error
    }

    if ( data ) {
        return data
    }

    return null
}