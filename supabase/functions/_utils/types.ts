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
    template_name: string,
    sent: boolean,
    created_at: string
}

export type MessageInsert = {
    to_user_id: string,
    subject: string,
    dynamic_data: object,
    template_name: string,
    sent: boolean
}

export type User = {
    id: string,
    email: string,
    name: string,
    created_at: string,
    phone: string,
    admin?: boolean
}

export type Organization = {
    id: string,
    created_at: string,
    address: string,
    name: string,
    slug: string,
    owner_id: string,
    featured_image_id: string | null,
    user?: User
}

export type Repository = {
    id: string,
    created_at: string,
    name: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    postal_code: string,
    country_code: string,
    geography: string,
    active: boolean,
    organization_id: string,
    featured_image_id: string
}

export type Request = {
    id: string,
    created_at: string,
    updated_at: string,
    repository_id: string,
    repository?: Repository,
    citation: string,
    pages: number,
    status_id: string,
    user_id: string,
    user?: User
}

export type Response = {
    status: string,
    message: string
}

export type Personalization = {
    to: {
        email: string
    }[],
    dynamic_template_data: any
}

export type EmailData = {
    personalizations: Personalization[],
    from: {
        email: string,
        name: string,
    },
    template_id: string,
    subject: string
}
