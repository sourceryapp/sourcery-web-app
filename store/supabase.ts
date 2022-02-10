import type { User } from "@supabase/supabase-js"
import { PaymentAssociation } from '~/models/PaymentAssociation'
import { User as SourceryUser } from '~/models/User'
import { Commit } from 'vuex'
import { supabase } from "~/plugins/supabase"

// Establish an interface for our Supabase state.
interface SupabaseState {
    authUser: User | null,
    authUserMeta: SourceryUser | null,
    authUserPaymentAssociation: PaymentAssociation | null
}

// Initialize state.
const initialState = () : SupabaseState => {
    return {
        authUser: null,
        authUserMeta: null,
        authUserPaymentAssociation: null
    }
}

export const state = initialState

export const getters = {
    authUser(state : SupabaseState) {
        return state.authUser
    },
    authUserMeta(state: SupabaseState) {
        return state.authUserMeta
    },
    isAuthenticated(state : SupabaseState) {
        return state.authUser && state.authUser.aud === "authenticated"
    },
    authUserPaymentAssociation(state: SupabaseState) {
        return state.authUserPaymentAssociation
    }
}

export const mutations = {
    setAuthUser(state : SupabaseState, value: User) {
        state.authUser = value
    },
    setAuthUserPaymentAssociation(state: SupabaseState, value: PaymentAssociation) {
        state.authUserPaymentAssociation = value
    },
    setAuthUserMeta(state: SupabaseState, value: SourceryUser) {
        state.authUserMeta = value
    },
    clear(state: SupabaseState) {
        state.authUser = null
    }
}

export const actions = {
    async saveAuthUserPaymentAssociation({ commit }: { commit: Commit }, paymentAssociation : PaymentAssociation) {
        const pa = new PaymentAssociation(paymentAssociation)
        const success = await pa.save()
        if ( success ) {
            commit('setAuthUserPaymentAssociation', pa.toJSON())
        }
        return success
    },
    async fetchAuthUserPaymentAssociation({ state, commit }: { state: SupabaseState, commit: Commit}) {
        if ( state.authUser ) {
            const pa = await PaymentAssociation.getFromUser(state.authUser)
            if ( pa && pa.id ) {
                commit('setAuthUserPaymentAssociation', pa.toJSON())
                return true
            }
        }
        return false
    },
    async fetchUserMeta({ state, commit }: { state: SupabaseState, commit: Commit}) {
        if ( state.authUser ) {
            let { data: user, error } = await supabase.from<SourceryUser>('user').select('*').eq('id', state.authUser.id)
            if ( Array.isArray(user) && user.length > 0 && user[0] && user[0].id ) {
                const u = new SourceryUser(user[0])
                commit('setAuthUserMeta', u.toJSON())
                return true
            }
        }
        return false
    }
}
