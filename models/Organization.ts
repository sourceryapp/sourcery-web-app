import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'organizations'

export class Organization {
    id: BigInt | null
    address: string
    name: string
    slug: string
    owner_id: string
    featured_image_id: BigInt | null
    created_at: string | null

    constructor({
        id = null,
        address,
        name,
        slug,
        owner_id,
        featured_image_id = null,
        created_at = null
    }: Organization) {
        this.id = id,
        this.address = address
        this.name = name
        this.slug = slug
        this.owner_id = owner_id
        this.featured_image_id = featured_image_id
        this.created_at = created_at
    }
}