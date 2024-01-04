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

function get_function_headers(token: string) {
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
}

export async function notify({ action, user_id, request_id, message_text, token, rp_id } : NotifyParams) {
    /** Bit clunky at the moment, but toggle this if testing emails. */
    if (!is_prod || !token) {
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

export async function prospective ({ id, user_id, title, description, repository_name, repository_location, created_at, token } : ProspectiveParams) {
    if (!is_prod || !token || id === null || created_at === null) {
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

    const url = `${functions_base}/${fname}`
    console.log(url)

    const { data: result } = await supabase.functions.invoke(fname, { body: data })

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
        body: JSON.stringify(request_data)
    })

    if ( error ) {
        console.log(error)
        return false
    }

    return data
}
