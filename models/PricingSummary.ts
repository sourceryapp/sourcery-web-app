import { supabase } from '~/plugins/supabase'
import type { definitions } from '~/types/supabase'

const TABLE_NAME = 'pricing_summaries'

export class PricingSummary {
    id: BigInt | null
    request_id: BigInt
    base_fee: Number
    service_fee: Number
    total: Number
    created_at: string | null

    constructor({
        id = null,
        request_id,
        base_fee = 0,
        service_fee = 0,
        total = 0,
        created_at = null
    }: PricingSummary) {
        this.id = id,
        this.request_id = request_id
        this.base_fee = base_fee
        this.service_fee = service_fee
        this.total = total
        this.created_at = created_at
    }
}