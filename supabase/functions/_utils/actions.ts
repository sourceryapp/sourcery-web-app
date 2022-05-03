import type { Message } from './types.ts'
import { actionTypes } from './global_constants.ts'
import { 
    supabaseClient,
    jwtDecoder,
    getRequest,
    getOrganization,
    getUser
} from './supabase.ts'
import { buildEmailData, saveAndSend } from './mailer.ts'

export const request_submitted_to_your_org = async (authToken : string, request_id : string) => {
    const request = await getRequest(authToken, request_id)

    if ( request && request?.repository?.organization_id ) {
        const organization = await getOrganization(authToken, request.repository.organization_id)

        const email_to_send = organization?.user?.email
        const id_to_send = organization?.owner_id
        
        if ( email_to_send && id_to_send ) {
            const email_data = buildEmailData(
                email_to_send,
                'Request Submitted to your Organization',
                'request_submitted_to_your_org',
                {
                    button_url: 'https://sourceryapp.org/request/' + request_id,
                    citation: request.citation
                }
            )

            return await saveAndSend(
                'request_submitted_to_your_org',
                id_to_send,
                email_data
            )
        }
    }

    return false
}


export const request_you_submitted_picked_up = async (authToken : string, request_id : string) => {
    const request = await getRequest(authToken, request_id)

    if ( request ) {
        const email_to_send = request.user?.email
        const id_to_send = request.user_id

        if ( email_to_send && id_to_send ) {
            const email_data = buildEmailData(
                email_to_send,
                'Request Picked Up',
                'request_you_submitted_picked_up',
                {
                    button_url: 'https://sourceryapp.org/request/' + request_id,
                    citation: request.citation
                }
            )

            return await saveAndSend(
                'request_you_submitted_picked_up',
                id_to_send,
                email_data
            )
        }
    }

    return false
}

export const request_you_submitted_complete = async (authToken : string, request_id : string) => {
    const request = await getRequest(authToken, request_id)

    if ( request ) {
        const email_to_send = request.user?.email
        const id_to_send = request.user_id

        if ( email_to_send && id_to_send ) {
            const email_data = buildEmailData(
                email_to_send,
                'Request Complete',
                'request_you_submitted_complete',
                {
                    button_url: 'https://sourceryapp.org/request/' + request_id,
                    citation: request.citation
                }
            )

            return await saveAndSend(
                'request_you_submitted_complete',
                id_to_send,
                email_data
            )
        }
    }

    return false
}

export const signed_up = async (authToken : string, user_id : string) => {
    const user = await getUser(authToken, user_id)

    if ( user ) {
        const email_to_send = user.email
        const id_to_send = user_id

        if ( email_to_send && id_to_send ) {
            const email_data = buildEmailData(
                email_to_send,
                'Welcome to Sourcery',
                'signed_up',
                {
                    button_url: 'https://sourceryapp.org/'
                }
            )

            return await saveAndSend(
                'signed_up',
                id_to_send,
                email_data
            )
        }
    }
}