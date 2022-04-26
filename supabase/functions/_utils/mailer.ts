const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') ?? ""
const SENDGRID_FROM_EMAIL = Deno.env.get("SENDGRID_APP_EMAIL") ?? "research.tube@gmail.com"
const SENDGRID_REST_BASE = "https://api.sendgrid.com/v3"
const SENDGRID_TEMPLATES = {
    'find_job': 'd-c8ab28dc6c4444ea8addd50ffcd6bf73',
    'complete': 'd-5c92e530ab8b46958c1291b4af0fb125',
    'picked_up': 'd-8f2e4c8d02204a7985dc26865b3011d6'
}

const buildEmailData = (template_name : string, dynamic_data) => {
    const msg = {
        to: client.email,
        from: `Sourcery Team <${functions.config().sendgrid.app_email}>`,
        subject: 'Sourcery Job Complete!',
        templateId: templates[document.status],
        dynamic_template_data: {
            name: client_name,
            button_url: button_url
        }
    }
}

export const logMailer = () => {
    
}