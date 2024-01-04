import { supabase } from '~/plugins/supabase'

const supabase_url_base = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace('.supabase.co', '') : ''
let functions_base = supabase_url_base + '.functions.supabase.co'

// Modifying so we have the ability to test on local supabase
if ( process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('localhost:') ) {
    functions_base = process.env.SUPABASE_URL + '/functions/v1'
}

const is_prod = process.env.NODE_ENV === 'production'

export type NotifyParams = {
    action: string,
    user_id: string,
    request_id?: number,
    message_text?: string,
    token?: string,
    rp_id?: number
}

export type ProspectiveParams = {
    id: number | null,
    user_id: string,
    title: string,
    description: string,
    repository_name: string,
    repository_location?: string,
    created_at: string | null,
    token?: string
}

export type GetOrCreateUserParams = {
    email: string
}

export async function notify({ action, user_id, request_id, message_text, rp_id } : NotifyParams) {
    /** Bit clunky at the moment, but toggle this if testing emails. */
    if (!is_prod) {
        return false
    }

    const fname = 'notify'
    const function_data = {
        action,
        user_id,
        request_id,
        message_text,
        rp_id
    }

    const { data } = await supabase.functions.invoke(fname, { body: function_data })

    return data
}

/**
 * Responsible for running the edge function to push a prospective entry to spreadsheet.
 * @param props id, user_id, title, description, repository_name, repository_location, created_at values for the prospective entry. 
 * @returns result of the function call, object typically.
 */
export async function prospective ({ id, user_id, title, description, repository_name, repository_location, created_at } : ProspectiveParams) {
    if (!is_prod || id === null || created_at === null) {
        return false
    }
    const fname = 'prospective'

    const data = {
        id,
        user_id,
        title,
        description,
        repository_name,
        repository_location,
        created_at
    }

    const { data: result, error } = await supabase.functions.invoke(fname, { body: data })

    return result
}


export async function get_or_create_user({ email } : GetOrCreateUserParams) {
    if ( !email ) {
        return false
    }

    const fname = 'get_or_create_user'
    const request_data = {
        email
    }

    const { data, error } = await supabase.functions.invoke(fname, {
        body: request_data
    })

    if ( error ) {
        console.log(error)
        return false
    }

    return data
}
