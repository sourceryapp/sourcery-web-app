import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'request_vendors'

export class RequestVendor {
    request_id: number
    label: string

    constructor({
        request_id,
        label
    }: RequestVendor) {
        this.request_id = request_id
        this.label = label
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
}