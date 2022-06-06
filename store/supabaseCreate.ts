import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Attachment } from '~/models/Attachment'
import { User as SourceryUser } from '~/models/User'
import { Repository } from '~/models/Repository'
import { Status } from '~/models/Status'
import { Request } from '~/models/Request'
import { IntegrationData } from '~/models/IntegrationData'
import { PricingSummary } from '~/models/PricingSummary'
import { notify } from '~/plugins/sourcery-functions'
import { getToken } from '~/plugins/supabase'

export const initialState = () => {
    return {
        client: null as SourceryUser | null,
        citation: '',
        repository: null as Repository | null,
        pages: 0,
        label: '',
        status: null as Status | null,
        integrationData: null as IntegrationData | null,
        pricing: null as PricingSummary | null
    }
}

export type SupabaseCreateState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    citation(state: SupabaseCreateState) {
        return state.citation
    },
    pages(state: SupabaseCreateState) {
        return state.pages
    },
    repositoryName(state: SupabaseCreateState) {
        if (state.repository) {
            let name = state.repository.name
            if (state.repository.organization) {
                name += ` - ${state.repository.organization.name}`
            }
            return name
        }
        return ''
    },
    repositoryId(state: SupabaseCreateState) {
        if (state.repository) {
            return state.repository.id
        }
        return null
    },
    hasRepository(state: SupabaseCreateState) {
        return !!state.repository
    },
    pricing(state: SupabaseCreateState) {
        return state.pricing
    },
    integrationData(state: SupabaseCreateState) {
        return state.integrationData
    },
    hasIntegrationData(state: SupabaseCreateState) {
        return !!state.integrationData
    }
}

export const mutations: MutationTree<SupabaseCreateState> = {
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
        if (match && match.length > 0) {
            state.label = match[0].trim()
        }
    },
    setClient(state: SupabaseCreateState, value: SourceryUser) {
        state.client = value
    },
    setStatus(state: SupabaseCreateState, value: Status) {
        state.status = value
    },
    setIntegrationData(state: SupabaseCreateState, value: IntegrationData) {
        state.integrationData = value
    },
    setPricing(state: SupabaseCreateState, value: PricingSummary) {
        state.pricing = value
    },
    reset(state: SupabaseCreateState) {
        const initial = initialState()
        state.client = initial.client
        state.citation = initial.citation
        state.repository = initial.repository
        state.pages = initial.pages
        state.label = initial.label
        state.status = initial.status
        state.integrationData = initial.integrationData
        state.pricing = initial.pricing
    }
}

export const actions: ActionTree<SupabaseCreateState, SupabaseCreateState> = {
    async insert({ state, commit, rootGetters }: { state: SupabaseCreateState, commit: Commit, rootGetters: any }) {
        commit('setLabel')

        commit('setClient', rootGetters['supabaseAuth/authUser'])

        const submittedStatus = await Status.getByName('Submitted')

        if (!submittedStatus) {
            console.log('Was not able to receive a status.')
            return null
        }

        commit('setStatus', submittedStatus)

        if (!state.status || !state.status.id || !state.repository || !state.repository.id || !state.client || !state.client.id) {
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

        if (r) {
            // Successful insert.
            commit('reset')
            if (Array.isArray(r) && r.length > 0) {
                const id = r[0].id
                await notify({
                    user_id: rootGetters['supabaseAuth/authUser'].id,
                    request_id: id,
                    action: 'request_submitted_to_your_org',
                    token: await getToken(),
                    message_text: null
                })
            }
        }

        return r
    }
}