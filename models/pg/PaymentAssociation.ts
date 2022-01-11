import { supabase } from '~/plugins/supabase'
import { SourceryUser } from '~/models/pg/User'

const TABLE_NAME = 'public.payment_associations'

interface SourceryPaymentAssociation {
    id: BigInteger,
    stripe_access_token: string,
    stripe_livemode: Boolean,
    stripe_refresh_token: string,
    stripe_scope: string,
    stripe_publishable_key: string,
    stripe_user_id: string,
    stripe_token_type: string,
    stripe_customer_id: string,
    user_id: string,
    created_at: Date
}

export class PaymentAssociation {
    id: BigInteger
    stripe_access_token: string
    stripe_livemode: Boolean
    stripe_refresh_token: string
    stripe_scope: string
    stripe_publishable_key: string
    stripe_user_id: string
    stripe_token_type: string
    stripe_customer_id: string
    user_id: string
    created_at: Date

    constructor({ 
        id,
        stripe_access_token,
        stripe_livemode,
        stripe_refresh_token,
        stripe_scope,
        stripe_publishable_key,
        stripe_user_id,
        stripe_token_type,
        stripe_customer_id,
        user_id,
        created_at
    }: SourceryPaymentAssociation) {
        this.id = id
        this.stripe_access_token = stripe_access_token
        this.stripe_livemode = stripe_livemode
        this.stripe_refresh_token = stripe_refresh_token
        this.stripe_scope = stripe_scope
        this.stripe_publishable_key = stripe_publishable_key
        this.stripe_user_id = stripe_user_id
        this.stripe_token_type = stripe_token_type
        this.stripe_customer_id = stripe_customer_id
        this.user_id = user_id
        this.created_at = created_at
    }

    public async getFromUser(user : SourceryUser|string) {
        let id = ''
        if ( typeof user === 'string' ) {
            id = user
        } else {
            id = user.id
        }
        
        try {
            let { data: payment_associations, error } = await supabase
                .from(TABLE_NAME)
                .select("*")
                .eq('user_id', id)

            if ( error || payment_associations === null ) {
                throw error
            }

            return new PaymentAssociation(payment_associations[0])
        } catch( error ) {
            console.log(error)
            return false
        }
    }
}