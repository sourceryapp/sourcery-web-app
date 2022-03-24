import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'request_events'

export class RequestEvent {
    id: number | null
    request_id: number
    user_id: string
    description: string
    status_id: number
    created_at: string | null

    constructor({
        id = null,
        request_id,
        user_id,
        description,
        status_id,
        created_at = null
    }: RequestEvent) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.description = description
        this.status_id = status_id
        this.created_at = created_at
    }
}
