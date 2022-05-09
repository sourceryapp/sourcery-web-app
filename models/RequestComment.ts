import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'
import type { Request } from '~/models/Request'

const TABLE_NAME = 'request_comments'

export type CreateRequestComment = {
    id: number | null
    request_id: number
    user_id: string
    content: string
    created_at: string | null
    vendor: boolean
}

export class RequestComment {
    id: number | null
    request_id: number
    user_id: string
    content: string
    created_at: string | null
    vendor: boolean

    constructor({
        id = null,
        request_id,
        user_id,
        content,
        created_at = null,
        vendor = false
    }: CreateRequestComment) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.content = content
        this.created_at = created_at
        this.vendor = vendor
    }

    toInsertJSON() {
        return {
            request_id: this.request_id,
            user_id: this.user_id,
            content: this.content,
            vendor: this.vendor
        }
    }

    public static async getForRequest(request: Request | null) {
        if ( !request || !request.id ) {
            return []
        }

        const query = supabase.from(TABLE_NAME)
            .select(`
                *
            `)
            .order('created_at', { ascending: false })
            .eq('request_id', request.id)

        let { data, error } = await query

        if ( Array.isArray(data) ) {
            const rms = data.map(x => new RequestComment(x))
            return rms
        }

        return []
    }

    async insert() {
        const { data: requestComment, error } = await supabase.from(TABLE_NAME)
            .insert([
                this.toInsertJSON()
            ])
        
        if ( error ) {
            console.log(error)
            return null
        }

        if ( Array.isArray(requestComment) && requestComment.length > 0 ) {
            return requestComment[0]
        }

        return null
    }
}
