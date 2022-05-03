/** A reminder this uses a DENO runtime. */

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { supabaseClient, jwtDecoder, getLastMessageForUser } from "../_utils/supabase.ts"
import { sendTest } from '../_utils/mailer.ts'
import { actionTypes } from '../_utils/global_constants.ts'
import type { TemplateLookup, Response } from '../_utils/types.ts'
import { 
    request_submitted_to_your_org,
    request_you_submitted_picked_up,
    request_you_submitted_complete,
    signed_up
} from '../_utils/actions.ts'

console.log("Serving the Notify functions.")
const url = Deno.env.get('API_URL')
console.log(`Serving from ${url}.`)

serve(async (req) => {
    const { action, request_id, user_id } = await req.json()
    const responseInit = {
        status: 200,
        headers: { "Content-Type": "application/json" }
    }

    if ( !actionTypes.includes(action) ) {
        responseInit.status = 400
        return new Response(
            JSON.stringify({
                status: 'error',
                message: 'Action provided is not within the scope of this function.  Please provide a valid action parameter.'
            }),
            responseInit
        )
    }

    const authHeader = req.headers.get("Authorization")!
    const authToken = authHeader.replace("Bearer ", "")
    const decoded = jwtDecoder(authToken)

    if (decoded.role !== 'authenticated') {
        responseInit.status = 403
        return new Response(
            JSON.stringify({
                status: 'error',
                message: 'Could not find a user associated with the passed authentication.'
            }),
            responseInit
        )
    }

    // const sendTestResponse = await sendTest()
    let notify_data : Response = {
        status: 'success',
        message: 'Success.'
    }

    try {
        switch (action) {
            case 'request_submitted_to_your_org':
                if ( !request_id ) {
                    notify_data.status = 'error',
                    notify_data.message = 'Missing a request_id parameter.  Exiting.'
                    responseInit.status = 400
                } else {
                    const status = await request_submitted_to_your_org(authToken, request_id)
                }
                break;

            case 'request_you_submitted_picked_up':
                if ( !request_id ) {
                    notify_data.status = 'error'
                    notify_data.message = 'Missing a request_id parameter.  Exiting.'
                    responseInit.status = 400
                } else {
                    const status = await request_you_submitted_picked_up(authToken, request_id)
                }
                break;

            case 'request_you_submitted_complete':
                if ( !request_id ) {
                    notify_data.status = 'error'
                    notify_data.message = 'Missing a request_id parameter.  Exiting.'
                    responseInit.status = 400
                } else {
                    const status = await request_you_submitted_complete(authToken, request_id)
                }
                break;

            case 'signed_up':
                if ( !user_id ) {
                    notify_data.status = 'error'
                    notify_data.message = 'Missing a user_id parameter.  Exiting.'
                    responseInit.status = 400
                } else {
                    const status = await signed_up(authToken, user_id)
                }

            case 'test':
                notify_data.status = 'test'
                notify_data.message = Deno.env.get('SUPABASE_URL') ?? ""
                break;

            default:
                break;
        }
    } catch(e) {
        responseInit.status = 400
        return new Response(
            JSON.stringify({
                status: 'error',
                message: e.message
            }),
            responseInit
        )
    }

    return new Response(
        JSON.stringify(notify_data),
        responseInit
    )
})
