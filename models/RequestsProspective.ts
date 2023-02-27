import { supabase } from '~/plugins/supabase'
import { User } from '~/models/User'

const TABLE_NAME = 'requests_prospective'

export type CreateRequestsProspective = {
    id: number | null,
    user_id: string,
    title: string,
    description: string,
    repository_name: string,
    repository_location: string,
    created_at: string | null,
    user?: User
}

export type CreateRequestsProspectiveFresh = {
    id?: number | null,
    user_id: string,
    title: string,
    description: string,
    repository_name: string,
    repository_location: string,
    created_at?: string | null,
    user?: User
}

export class RequestsProspective {
    id: number | null
    user_id: string
    title: string
    description: string
    repository_name: string
    repository_location: string
    created_at: string | null
    user?: User

    constructor({
        id = null,
        user_id,
        title,
        description,
        repository_name,
        repository_location,
        created_at = null,
        user = undefined
    }: CreateRequestsProspective | CreateRequestsProspectiveFresh) {
        this.id = id
        this.user_id = user_id
        this.title = title
        this.description = description
        this.repository_name = repository_name
        this.repository_location = repository_location
        this.created_at = created_at

        if ( user ) {
            this.user = new User(user)
        }
    }

    toInsertJSON() {
        return {
            user_id: this.user_id,
            title: this.title,
            description: this.description,
            repository_name: this.repository_name,
            repository_location: this.repository_location
        }
    }

    toSpreadsheetJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            title: this.title,
            description: this.description,
            repository_name: this.repository_name,
            repository_location: this.repository_location,
            created_at: this.created_at
        }
    }

    async insert() {
        const { data: request_prospective, error } = await supabase.from(TABLE_NAME)
            .insert([
                this.toInsertJSON()
            ])

        if ( error ) {
            console.log(error)
            return null
        }

        if ( request_prospective[0] ) {
            return new RequestsProspective(request_prospective[0])
        }

        return null
    }


    static async getForUser(user_id: string) {
        const { data: requests, error } = await supabase.from(TABLE_NAME)
            .select(`*`)
            .order('created_at', { ascending: false })
            .eq('user_id', user_id)

        if ( Array.isArray(requests) ) {
            const rp = requests.map(x => new RequestsProspective(x))
            return rp
        }

        return []
    }

    static async countForUser(user_id: string) {
        const query = supabase.from(TABLE_NAME)
            .select('user_id', { count: 'exact' })
            .eq('user_id', user_id)

        let { data, error, count } = await query

        return count
    }
}