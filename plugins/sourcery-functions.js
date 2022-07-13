import axios from 'axios'

const supabase_url_base = process.env.SUPABASE_URL.replace('.supabase.co', '')
const functions_base = supabase_url_base + '.functions.supabase.co'
const is_prod = process.env.NODE_ENV === 'production'

export const notify = async ({ action, user_id, request_id, message_text, token }) => {
    /** Bit clunky at the moment, but toggle this if testing emails. */
    if (!is_prod) {
        return false
    }

    const fname = 'notify'
    const data = {
        action,
        user_id,
        request_id,
        message_text
    }

    const result = await axios.post(`${functions_base}/${fname}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    return result
}

export default ({ app, store }, inject) => {
    const sourceryFunctions = (() => {
        return {
            notify: async ({ action, user_id, request_id, message_text }) => {
                const token = await store.dispatch('supabaseAuth/getToken')
                const result = await notify({ action, user_id, request_id, message_text, token })
                return result
            }
        }
    })()

    inject('sourceryFunctions', sourceryFunctions)
}
