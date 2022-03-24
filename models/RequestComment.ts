import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'request_comments'

export class RequestComment {
    id: number | null
    request_id: number
    user_id: string
    content: string
    created_at: string | null

    constructor({
        id = null,
        request_id,
        user_id,
        content,
        created_at = null
    }: RequestComment) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.content = content
        this.created_at = created_at
    }
}
