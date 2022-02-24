import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Attachment } from '~/models/Attachment'
import { User as SourceryUser } from '~/models/User'
import { Repository } from '~/models/Repository'

export const initialState = () => {
    return {
        attachments: [] as Attachment[],
        client: null as SourceryUser | null,
        citation: '',
        repository: null as Repository | null,
        pages: 0
    }
}

export type SupabaseCreateState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    
}