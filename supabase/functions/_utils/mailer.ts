import type { TemplateLookup, MessageInsert } from './types.ts'

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
        return false
    }

    const msg = {
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

    return msg
}

export const sendTest = async () => {
    const postRequest = await fetch(SENDGRID_REST_BASE + '/mail/send', {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + SENDGRID_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildEmailData(
            'brian.kelleher@uconn.edu',
            'Test Email',
            'general',
            {
                message: "This is a test.",
                button_text: "Test Button",
                button_url: "https://sourceryapp.org"
            }
        ))
    })

    if ( postRequest.status == 202 && postRequest.ok ) {
        return true
    }

    return false
}