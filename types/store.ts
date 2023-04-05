import type { Commit, Dispatch } from 'vuex'

export interface VuexActionParams<T> {
    commit: Commit
    dispatch: Dispatch
    rootGetters: any
    state: T
}