import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'attachments'

export class Attachment {
    id: BigInt | null
    request_id: BigInt
    user_id: string
    url: string
    mime: string
    label: string
    pages: Number
    created_at: string | null

    constructor({
        id = null,
        request_id,
        user_id,
        url,
        mime,
        label,
        pages,
        created_at = null
    }: Attachment) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.url = url
        this.mime = mime
        this.label = label
        this.pages = pages
        this.created_at = created_at
    }
}