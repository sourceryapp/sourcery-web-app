import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'request_vendor'

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
}