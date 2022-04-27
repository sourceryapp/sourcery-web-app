/** A reminder this uses a DENO runtime. */

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { supabaseClient, jwtDecoder, getLastMessageForUser } from "../_utils/supabase.ts"
import { sendTest } from '../_utils/mailer.ts'
import { actionTypes } from '../_utils/global_constants.ts'
import type { TemplateLookup } from '../_utils/types.ts'
import { 
    request_submitted_to_your_org
} from '../utils/actions.ts'

console.log("Serving the Notify functions.")
const url = Deno.env.get('API_URL')
console.log(`Serving from ${url}.`)

serve(async (req) => {
    const { action, request_id } = await req.json()

    if ( !actionTypes.includes(action) ) {
        return new Response(
            JSON.stringify({
                status: 'error',
                message: 'Action provided is not within the scope of this function.  Please provide a valid action parameter.'
            }),
            { headers: { "Content-Type": "application/json" } }
        )
    }

    const authHeader = req.headers.get("Authorization")!
    const authToken = authHeader.replace("Bearer ", "")
    const decoded = jwtDecoder(authToken)

    if (decoded.role !== 'authenticated') {
        return new Response(
            JSON.stringify({
                status: 'error',
                message: 'Could not find a user associated with the passed authentication.'
            }),
            { headers: { "Content-Type": "application/json" } }
        )
    }

    try {
        const message = await getLastMessageForUser(decoded.sub)
        if (message) {
            console.log('message')
            console.log(message)

            const message_date = new Date(message.created_at)
            const current_date = new Date()

            const diff_milli = current_date.getTime() - message_date.getTime()
            const diff_seconds = diff_milli / 1000

            if ( diff_seconds < 30 ) {
                return new Response(
                    JSON.stringify({
                        status: 'error',
                        message: 'User has already received an email of this type recently.  Saving a record but not sending an email.'
                    })
                )
            }
        }
    } catch (e) {
        return new Response(
            JSON.stringify({
                status: 'error',
                message: e.message
            }),
            { headers: { "Content-Type": "application/json" } }
        )
    }

    // const sendTestResponse = await sendTest()
    switch (action) {
        case 'request_submitted_to_your_org':
            await request_submitted_to_your_org(authToken, request_id)
            break;
    
        default:
            break;
    }


    const data = {
        decoded: decoded,
        supabaseUrl: Deno.env.get('SUPABASE_URL')
    }

    return new Response(
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } },
    )
})
