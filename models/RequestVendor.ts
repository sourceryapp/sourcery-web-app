import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'request_vendors'

export type CreateRequestVendor = {
    request_id: number,
    label: string
}

export class RequestVendor {
    request_id: number
    label: string

    constructor({
        request_id,
        label
    }: CreateRequestVendor) {
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

    static async updateById(id: number, { label } : { label: string }) {
        const rv = new RequestVendor({ request_id: id, label })
        return await rv.update(label)
    }
}