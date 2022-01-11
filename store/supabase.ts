import { User } from "@supabase/supabase-js"

interface SupabaseState {
    authUser: User | null
}

const initialState = () : SupabaseState => {
    return {
        authUser: null
    }
}

export const state = initialState()

export const getters = {
    authUser(state : SupabaseState) {
        return state.authUser
    },
    isAuthenticated(state : SupabaseState) {
        return state.authUser && state.authUser.aud === "authenticated"
    }
}

export const mutations = {
    setAuthUser(state : SupabaseState, value: User) {
        state.authUser = value
    },
    clear(state: SupabaseState) {
        state.authUser = null
    }
}
