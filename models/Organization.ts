import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'
import { Repository } from '~/models/Repository'

const TABLE_NAME = 'organizations'

export class Organization {
    id: number | null
    address: string
    name: string
    slug: string
    owner_id: string
    featured_image_id: number | null
    created_at: string | null
    repositories?: Repository[]

    constructor({
        id = null,
        address,
        name,
        slug,
        owner_id,
        featured_image_id = null,
        created_at = null,
        repositories = undefined
    }: Organization) {
        this.id = id,
        this.address = address
        this.name = name
        this.slug = slug
        this.owner_id = owner_id
        this.featured_image_id = featured_image_id
        this.created_at = created_at

        if ( repositories ) {
            this.repositories = repositories
        }

    }

    public static async getByOwner(user_id: string) {
        let { data: organizations, error } = await supabase.from('organizations')
            .select(`
                *,
                repositories(*)
            `)
            .eq('owner_id', user_id)

        if ( Array.isArray(organizations) && organizations.length > 0 && organizations[0] ) {
            const orgs = organizations.map(x => new Organization(x))
            return orgs
        }
        return []
    }

    public static async getById(id: string) {
        let { data: org, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                repositories (*)
            `)
            .eq('id', id)
            .limit(1)
            .single()

        if ( org ) {
            return new Organization(org)
        }
        return null
    }

    public static async getBySlug(slug: string) {
        let { data: org, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                repositories (*)
            `)
            .eq('slug', slug)
            .limit(1)
            .single()

        if ( org ) {
            return new Organization(org)
        }
        return null
    }
}