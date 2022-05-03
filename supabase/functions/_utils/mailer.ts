import type { TemplateLookup, MessageInsert, EmailData } from './types.ts'
import { createMessage, getLastMessageByTypeForUser } from './supabase.ts'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') ?? ""
const SENDGRID_FROM_EMAIL = Deno.env.get("SENDGRID_APP_EMAIL") ?? "research.tube@gmail.com"
const SENDGRID_REST_BASE = "https://api.sendgrid.com/v3"
const SENDGRID_TEMPLATES : TemplateLookup = {
    'request_submitted_to_your_org': 'd-c8ab28dc6c4444ea8addd50ffcd6bf73',
    'request_you_submitted_picked_up': 'd-8f2e4c8d02204a7985dc26865b3011d6',
    'request_you_submitted_complete': 'd-5c92e530ab8b46958c1291b4af0fb125',
    'submitted_feedback': 'd-f4dcdc60e10f4739ab65f6963a24f1d8',
    'signed_up': 'd-6c1fc919d9c64fb497c6ccd47fd356ff',
    'general': 'd-56461c46fe4a4a1490d77f50e6b7a891'
}

/**
 * Dynamic Data Guide:
 * 
 * General:
 * - message: body of the message
 * - button_text: the call to action button text
 * - button_url: the call to action button url
 * 
 * Request Submitted to your Org:
 * - button_url: the call to action button url
 * - citation: the citation of the request submitted
 */

export const buildEmailData = (client_email : string, subject : string, template_name : keyof TemplateLookup, dynamic_data = {}) => {
    if ( !SENDGRID_TEMPLATES[template_name] ) {
        return null
    }

    return {
        personalizations: [
            {
                to: [
                    { email: client_email }
                ],
                dynamic_template_data: dynamic_data
            }
        ],
        from: {
            email: SENDGRID_FROM_EMAIL,
            name: 'Sourcery Team'
        },
        template_id: SENDGRID_TEMPLATES[template_name],
        subject: subject
    }
}

const send = async (emailData : EmailData | null) => {
    const postRequest = await fetch(SENDGRID_REST_BASE + '/mail/send', {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + SENDGRID_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
    })

    if ( postRequest.status == 202 && postRequest.ok ) {
        return true
    }

    return false
}

export const saveAndSend = async (type : keyof TemplateLookup, user_id : string, emailData : EmailData | null) => {
    let sent = false
    try {
        if ( emailData ) {
            let can_continue = false
            if ( type === 'signed_up' ) {
                can_continue = await neverDuplicate(user_id, type)
            } else {
                can_continue = await noDuplicateMessageInLastMinutes(user_id, type, 5)
            }
            if ( can_continue ) {
                sent = await send(emailData)
                const messages = await createMessage({
                    to_user_id: user_id,
                    subject: emailData.subject,
                    template_name: type,
                    dynamic_data: emailData.personalizations[0].dynamic_template_data,
                    sent: sent
                })
            }
        }
    } catch(e) {
        throw e
        return false
    }

    return sent
}

export const noDuplicateMessageInLastMinutes = async (to_user_id : string, template_name : string, minutes : number) => {
    const message = await getLastMessageByTypeForUser(to_user_id, template_name)
    if ( message ) {
        const message_date = new Date(message.created_at)
        const current_date = new Date()

        const diff_milli = current_date.getTime() - message_date.getTime()
        const diff_seconds = diff_milli / 1000
        const diff_minutes = diff_seconds / 60

        if ( minutes > diff_minutes ) {
            throw Error('Too many messages sent in set time period to this user.')
        }
    }

    return true
}

export const neverDuplicate = async (to_user_id : string, template_name : string) => {
    const message = await getLastMessageByTypeForUser(to_user_id, template_name)

    if ( message ) {
        throw Error('Already sent this user this type of email.')
    }

    return true
}


export const sendTest = async () => {
    const success = await send(buildEmailData(
        'brian.kelleher@uconn.edu',
        'Test Email',
        'general',
        {
            message: "This is a test.",
            button_text: "Test Button",
            button_url: "https://sourceryapp.org"
        }
    ))

    return success
}