import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Attachment } from '~/models/Attachment'
import { User as SourceryUser } from '~/models/User'
import { Repository } from '~/models/Repository'
import { Status } from '~/models/Status'
import { Request } from '~/models/Request'

export const initialState = () => {
    return {
        attachments: [] as Attachment[],
        client: null as SourceryUser | null,
        citation: '',
        repository: null as Repository | null,
        pages: 0,
        label: '',
        status: null as Status | null,
        integrationOrganizationId: null as number | null,
    }
}

export type SupabaseCreateState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    citation(state: SupabaseCreateState) {
        return state.citation
    }
}

export const mutations : MutationTree<SupabaseCreateState> = {
    setCitation(state: SupabaseCreateState, value: string) {
        state.citation = value
    },
    setPages(state: SupabaseCreateState, value: number) {
        state.pages = value
    },
    setRepository(state: SupabaseCreateState, value: Repository) {
        state.repository = value
    },
    setLabel(state: SupabaseCreateState) {
        const match = state.citation.match(/^(\w(\s|\.|\(|\))*)+/)
        if ( match && match.length > 0 ) {
            state.label = match[0].trim()
        }
    },
    setClient(state: SupabaseCreateState, value: SourceryUser) {
        state.client = value
    },
    setStatus(state: SupabaseCreateState, value: Status) {
        state.status = value
    },
    setIntegrationOrganizationId(state: SupabaseCreateState, id: number) {
        state.integrationOrganizationId = id
    },
    reset(state: SupabaseCreateState) {
        state = initialState()
    }
}

export const actions : ActionTree<SupabaseCreateState, SupabaseCreateState> = {
    async insert({ state, commit, rootGetters } : { state: SupabaseCreateState, commit: Commit, rootGetters: any }) {
        commit('setLabel')

        commit('setClient', rootGetters['supabaseAuth/authUser'])

        const submittedStatus = await Status.getByName('Submitted')

        if ( !submittedStatus ) {
            console.log('Was not able to receive a status.')
            return null
        }

        commit('setStatus', submittedStatus)

        if ( !state.status || !state.status.id || !state.repository || !state.repository.id || !state.client || !state.client.id ) {
            console.log('Was missing essential information to create a request.', state)
            return null
        }

        const request = new Request({
            repository_id: state.repository.id,
            citation: state.citation,
            pages: state.pages,
            status_id: state.status.id,
            user_id: state.client.id,
            id: null,
            created_at: null,
            updated_at: null
        })

        const r = await request.insert()

        if ( r ) {
            // Successful insert.
            commit('reset')
        }

        return r
    }
}