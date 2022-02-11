import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'requests'

export class Request {
    id: BigInt | null
    repository_id: BigInt
    citation: string
    pages: number
    status_id: BigInt
    user_id: string
    created_at: string | null
    updated_at: string | null

    constructor({
        id = null,
        repository_id,
        citation,
        pages,
        status_id,
        user_id,
        created_at = null,
        updated_at = null
    }: Request) {
        this.id = id,
        this.repository_id = repository_id
        this.citation = citation
        this.pages = pages
        this.status_id = status_id
        this.user_id = user_id
        this.created_at = created_at
        this.updated_at = updated_at
    }
}