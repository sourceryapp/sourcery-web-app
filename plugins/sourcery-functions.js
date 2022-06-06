import axios from 'axios'

const functions_base = 'https://csfzqcahdlzghhzgbvtq.functions.supabase.co'

export const notify = async ({ action, user_id, request_id, message_text, token }) => {
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
