import type { User } from "@supabase/supabase-js"
import { PaymentAssociation } from '~/models/PaymentAssociation'
import { User as SourceryUser } from '~/models/User'
import { Organization } from '~/models/Organization'
import { Commit } from 'vuex'
import { supabase } from "~/plugins/supabase"

// Establish an interface for our Supabase state.
interface SupabaseState {
    authUser: User | null,
    authUserMeta: SourceryUser | null,
    authUserPaymentAssociation: PaymentAssociation | null,
    authUserOrganizations: Organization[]
}

// Initialize state.
const initialState = () : SupabaseState => {
    return {
        authUser: null,
        authUserMeta: null,
        authUserPaymentAssociation: null,
        authUserOrganizations: []
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
    },
    ownsAnOrganization(state: SupabaseState) {
        return state.authUserOrganizations.length > 0
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
    setAuthUserOrganizations(state: SupabaseState, value: Organization[] ) {
        state.authUserOrganizations = value
    },
    clear(state: SupabaseState) {
        state = initialState()
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
            const meta = await SourceryUser.getById(state.authUser.id)
            if ( meta ) {
                commit('setAuthUserMeta', meta.toJSON())
                return true
            }
        }
        return false
    },
    async fetchUserOrganizations({ state, commit }: { state: SupabaseState, commit: Commit}) {
        if ( state.authUser ) {
            const orgs = await Organization.getByOwner(state.authUser.id)
            if ( orgs ) {
                commit('setAuthUserOrganizations', orgs)
                return true
            }
        }
        return false
    }
}
