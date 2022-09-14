import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'request_clients'

export class RequestClient {
    request_id: number
    label: string
    name: string | null

    constructor({
        request_id,
        label,
        name
    }: RequestClient) {
        this.request_id = request_id
        this.label = label
        this.name = name
    }

    async update(label: string) {
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update({ label: label })
            .eq('request_id', this.request_id)

        if ( error ) {
            console.log(error)
            return false
        }

        this.label = label
        return true
    }

    async updateName(name: string | null) {
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update({ name: name })
            .eq('request_id', this.request_id)

        if ( error ) {
            console.log(error)
            return false
        }

        this.name = name
        return true
    }

    async updateAll( { label, name } : { label: string, name: string} ) {
        const { data: updated, error } = await supabase.from(TABLE_NAME)
            .update({
                label,
                name
            })
            .eq('request_id', this.request_id)

        if ( error ) {
            console.log(error)
            return false
        }
        return true
    }
}