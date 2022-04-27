export type TemplateLookup = {
    'request_submitted_to_your_org': string
    'request_you_submitted_picked_up': string,
    'request_you_submitted_complete': string,
    'submitted_feedback': string,
    'signed_up': string,
    'general': string
}

export type Message = {
    id: string,
    to_user_id: string,
    subject: string,
    dynamic_data: object,
    template_id: string,
    sent: boolean,
    created_at: string
}

export type MessageInsert = {
    to_user_id: string,
    subject: string,
    dynamic_data: object,
    template_id: string,
    sent: boolean
}