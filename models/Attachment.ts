import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'attachments'

interface SourceryAttachment {
    id?: number | null
    request_id: number
    user_id: string
    url: string
    mime: string | null
    label: string
    pages: Number
    created_at?: string | null
}

export class Attachment implements SourceryAttachment {
    id?: number | null
    request_id: number
    user_id: string
    url: string
    mime: string | null
    label: string
    pages: Number
    created_at?: string | null

    constructor({
        id = null,
        request_id,
        user_id,
        url,
        mime,
        label,
        pages,
        created_at = null
    }: SourceryAttachment) {
        this.id = id,
        this.request_id = request_id
        this.user_id = user_id
        this.url = url
        this.mime = mime
        this.label = label
        this.pages = pages
        this.created_at = created_at
    }

    toInsertJSON() {
        return {
            request_id: this.request_id,
            user_id: this.user_id,
            url: this.url,
            mime: this.mime,
            label: this.label,
            pages: this.pages
        }
    }

    isPDF() {
        return this.url.includes('.pdf')
    }

    async insert() {
        const { data: attachment, error } = await supabase.from(TABLE_NAME)
            .insert([
                this.toInsertJSON()
            ])

        if ( error ) {
            console.log(error)
        }

        if ( attachment ) {
            return true
        }

        return false
    }

    async delete() {
        const { data: attachment, error } = await supabase.from(TABLE_NAME)
            .delete()
            .eq('id', this.id)

        if ( error ) {
            console.log(error)
        }

        return attachment
    }
}