import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'featured_images'

export class FeaturedImage {
    id: BigInt | null
    user_id: string
    url: string
    label: string
    created_at: string | null

    constructor({
        id = null,
        user_id,
        url,
        label,
        created_at = null
    }: FeaturedImage) {
        this.id = id,
        this.user_id = user_id
        this.url = url
        this.label = label
        this.created_at = created_at
    }
}