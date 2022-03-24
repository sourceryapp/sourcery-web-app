import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'request_clients'

export class RequestClient {
    request_id: number
    label: string

    constructor({
        request_id,
        label
    }: RequestClient) {
        this.request_id = request_id
        this.label = label
    }
}