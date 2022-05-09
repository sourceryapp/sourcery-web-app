import { Request } from '~/models/Request'
import { RequestComment } from '~/models/RequestComment'
import { Organization } from '~/models/Organization'
import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { supabase, getToken } from '~/plugins/supabase'
import { notify } from '~/plugins/sourcery-functions'

const initialState = () => {
    return {
        open: false,
        minimized: false,
        request: null as Request | null,
        messages: [] as RequestComment[],
        organization: null as Organization | null
    }
}

export type SupabaseChatState = ReturnType<typeof initialState>

export const state = initialState

export const getters: GetterTree<SupabaseChatState, SupabaseChatState> = {
    isOpen(state: SupabaseChatState) {
        return state.open
    },
    isMinimized(state: SupabaseChatState) {
        return state.minimized
    },
    messages(state: SupabaseChatState) {
        return state.messages
    },
    request(state: SupabaseChatState) {
        return state.request
    },
    organization(state: SupabaseChatState) {
        return state.organization
    }
}

export const mutations: MutationTree<SupabaseChatState> = {
    setRequest(state: SupabaseChatState, value: Request) {
        state.request = value
    },
    setMessages(state: SupabaseChatState, value: RequestComment[]) {
        state.messages = value
    },
    setOpen(state: SupabaseChatState, value: boolean) {
        state.open = value
    },
    setMinimized(state: SupabaseChatState, value: boolean) {
        state.minimized = value
    },
    setOrganization(state: SupabaseChatState, value: Organization | null) {
        state.organization = value
    },
    addMessage(state: SupabaseChatState, value: RequestComment) {
        state.messages.push(value)
    },
    clear(state: SupabaseChatState) {
        const initial = initialState()
        state.open = initial.open
        state.minimized = initial.minimized
        state.request = initial.request
        state.messages = initial.messages
    }
}

export const actions: ActionTree<SupabaseChatState, SupabaseChatState> = {
    async getMessagesForRequest({ state, commit } : { state: SupabaseChatState, commit : Commit }) {
        const messages = await RequestComment.getForRequest(state.request)
        commit('setMessages', messages)
        return true
    },
    async openForRequest({ dispatch, commit } : { dispatch: Dispatch, commit: Commit }, request : Request) {
        commit('clear')
        commit('setRequest', request)
        const organizationRetrieved = await dispatch('getOrganizationForRequest')
        const messagesRetrieved = await dispatch('getMessagesForRequest')
        commit('setOpen', true)
        commit('setMinimized', false)
        return true
    },
    async getOrganizationForRequest({ state, commit } : { state: SupabaseChatState, commit: Commit }) {
        if ( state.request && state.request.repository ) {
            const organization = await Organization.getById(state.request.repository.organization_id)
            commit('setOrganization', organization)
            return true
        }
        commit('setOrganization', null)
        return false
    },
    async sendMessage({ state, commit, rootGetters } : { state: SupabaseChatState, commit: Commit, rootGetters: any }, { messageText, vendor } : { messageText: string, vendor: boolean }) {
        if ( !messageText || typeof(vendor) == "undefined" || !state.request || !state.request.id ) {
            return false
        }

        const user_id = rootGetters['supabaseAuth/authUser'].id

        const requestComment = new RequestComment({
            id: null,
            request_id: state.request.id,
            user_id: user_id,
            content: messageText,
            created_at: null,
            vendor: vendor
        })
        const insert = await requestComment.insert()

        if ( insert ) {
            commit('addMessage', insert)
            try {
                const token = await getToken()
                const sendNotif = await notify({
                    user_id: user_id,
                    action: vendor ? 'chat_sent_from_vendor' : 'chat_sent_from_client',
                    token: token,
                    request_id: state.request.id,
                    message_text: messageText
                })
            } catch(e) {
                console.log('Error sending chat notification, might be rate limited.  This is normal.', e)
            }
            
            return true
        }

        return false
    }
}