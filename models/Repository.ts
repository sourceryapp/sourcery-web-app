import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'
import { Organization } from '~/models/Organization'

const TABLE_NAME = 'repositories'

export class Repository {
    id: number | null
    name: string
    address1: string
    address2: string
    city: string
    state: string
    postal_code: string
    country_code: string
    geography: string
    active: boolean
    organization_id: number
    featured_image_id: number | null
    created_at: string | null
    organization?: Organization

    constructor({
        id = null,
        name,
        address1,
        address2,
        city,
        state,
        postal_code,
        country_code,
        geography,
        active,
        organization_id,
        featured_image_id = null,
        created_at = null,
        organization = undefined
    }: Repository) {
        this.id = id,
        this.name = name
        this.address1 = address1
        this.address2 = address2
        this.city = city
        this.state = state
        this.postal_code = postal_code
        this.country_code = country_code
        this.geography = geography
        this.active = active
        this.organization_id = organization_id
        this.featured_image_id = featured_image_id
        this.created_at = created_at

        if ( organization ) {
            this.organization = organization
        }
    }

    public static async getActive() {
        const { data: repositories, error } = await supabase.from(TABLE_NAME)
            .select(`
                *,
                organization:organizations (*)
            `)
            .order('name')
            .eq('active', true)

        if ( error ) {
            console.log(error)
            return []
        }

        if ( Array.isArray(repositories) ) {
            console.log(repositories)
            const reps = repositories.map(x => new Repository(x))
            return reps
        }
        return []
    }
}
