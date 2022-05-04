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

const application_url = Deno.env.get('APPLICATION_URL') ?? "https://sourceryapp.org"

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
                    button_url: `${application_url}/request/${request_id}`,
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
                    button_url: `${application_url}/request/${request_id}`,
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
                    button_url: `${application_url}/request/${request_id}`,
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
                    button_url: `${application_url}`
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

export const chat = async (authToken : string, by_vendor : boolean, request_id : string, chat_text : string) => {
    const request = await getRequest(authToken, request_id)

    if ( request && request?.repository?.organization_id ) {
        const organization = await getOrganization(authToken, request.repository.organization_id)

        const email_to_send = by_vendor ? request.user?.email : organization.user?.email
        const id_to_send = by_vendor ? request.user_id : organization.owner_id

        /** Create Chat Record Here. request_comments? */

        if ( email_to_send && id_to_send ) {
            const template_name = by_vendor ? 'chat_sent_from_vendor' : 'chat_sent_from_client'
            const email_data = buildEmailData(
                email_to_send,
                'New Message in Sourcery',
                template_name,
                {
                    button_url: `${application_url}/request/${request_id}`,
                    button_text: 'View Request',
                    message: chat_text
                }
            )

            return await saveAndSend(
                template_name,
                id_to_send,
                email_data
            )
        }
    }
}