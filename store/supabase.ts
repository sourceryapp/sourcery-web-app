import { User } from "@supabase/supabase-js"
import { SourceryPaymentAssociation, PaymentAssociation } from '~/models/pg/PaymentAssociation'
import { Commit } from 'vuex'

interface SupabaseState {
    authUser: User | null,
    authUserPaymentAssociation: SourceryPaymentAssociation | null
}

const initialState = () : SupabaseState => {
    return {
        authUser: null,
        authUserPaymentAssociation: null
    }
}

export const state = initialState

export const getters = {
    authUser(state : SupabaseState) {
        return state.authUser
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
    setAuthUserPaymentAssociation(state: SupabaseState, value: SourceryPaymentAssociation) {
        state.authUserPaymentAssociation = value
    },
    clear(state: SupabaseState) {
        state.authUser = null
    }
}

export const actions = {
    async saveAuthUserPaymentAssociation({ commit }: { commit: Commit }, paymentAssociation : SourceryPaymentAssociation) {
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
    }
}
