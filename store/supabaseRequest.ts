import { Request } from '~/models/Request'
import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
import { Attachment } from '~/models/Attachment'
import { supabase, getToken } from '~/plugins/supabase'
import { notify } from "~/plugins/sourcery-functions"

// https://typescript.nuxtjs.org/cookbook/store/#vanilla <-- Helpful for inheriting other nuxt modules such as firebase into your actions/etc.

export const initialState = () => {
    return {
        request: null as Request | null
    }
}

export type SupabaseRequestState = ReturnType<typeof initialState>

export const state = initialState

export const getters = {
    request(state: SupabaseRequestState) {
        return state.request
    },
    id(state: SupabaseRequestState) {
        return (state.request) ? state.request.id : null
    },
    isComplete(state: SupabaseRequestState) {
        return state.request?.status?.name === 'Complete'
    },
    isPickedUp(state: SupabaseRequestState) {
        return state.request?.status?.name === 'In Progress'
    },
    isSubmitted(state: SupabaseRequestState) {
        return state.request?.status?.name === 'Submitted'
    },
    isArchived(state: SupabaseRequestState) {
        return state.request?.status?.name === 'Archived'
    },
    isCancelled(state: SupabaseRequestState) {
        return state.request?.status?.name === 'Cancelled'
    },
    prettyStatus(state: SupabaseRequestState) {
        return (state.request?.status?.name) ? state.request.status.name : 'Unknown'
    }
}


export const mutations: MutationTree<SupabaseRequestState> = {
    set(state: SupabaseRequestState, value: Request) {
        state.request = value
    },
    setClientLabel(state: SupabaseRequestState, value: string) {
        if ( state.request?.request_client ) {
            state.request.request_client.label = value
        }
    },
    setVendorLabel(state: SupabaseRequestState, value: string) {
        if ( state.request?.request_vendor ) {
            state.request.request_vendor.label = value
        }
    },
    clear(state: SupabaseRequestState) {
        const initial = initialState()
        state.request = initial.request
    }
}

export const actions: ActionTree<SupabaseRequestState, SupabaseRequestState> = {
    async getById({ commit }: { commit: Commit }, id: string) {
        const r = await Request.getById(id)
        commit('set', r)
        return true
    },
    async pickUp({ state, commit, dispatch, rootGetters }: { state: SupabaseRequestState, commit: Commit, dispatch: Dispatch, rootGetters: any }) {
        if (state.request) {
            const in_progress = await state.request.pickUp()
            if (in_progress) {
                await dispatch('getById', state.request.id)
                await notify({
                    user_id: rootGetters['supabaseAuth/authUser'].id,
                    request_id: state.request.id,
                    action: 'request_you_submitted_picked_up',
                    token: await getToken(),
                    message_text: null
                })
                return true
            }
        }
        return false
    },
    async cancel({ state, commit }: { state: SupabaseRequestState, commit: Commit }) {
        if (state.request) {
            const deleted = await state.request.cancel()
            if (deleted) {
                commit('clear')
                return true
            }
        }
        return false
    },
    async archive({ state }: { state: SupabaseRequestState }) {
        if (state.request) {
            const archived = await state.request.archive()
            if (archived) {
                return true
            }
        }
        return false
    },
    async complete({ state, rootGetters }: { state: SupabaseRequestState, rootGetters: any }) {
        if (state.request) {
            const completed = await state.request.complete()
            if (completed) {
                await notify({
                    user_id: rootGetters['supabaseAuth/authUser'].id,
                    request_id: state.request.id,
                    action: 'request_you_submitted_complete',
                    token: await getToken(),
                    message_text: null
                })
                return true
            }
        }
        return false
    },
    async setLabel({ state, commit }: { state: SupabaseRequestState, commit: Commit }, {
        client, label
    } : { client: boolean, label: string }) {
        if ( state.request ) {
            const r = new Request(state.request)
            const result = await r.saveLabel(client, label)

            if ( result ) {
                if ( client ) {
                    commit('setClientLabel', label)
                } else {
                    commit('setVendorLabel', label)
                }
                return result
            }
        }
        return false
    },
    async addAttachment({ state, dispatch, rootGetters }: { state: SupabaseRequestState, dispatch: Dispatch, rootGetters: any }, file: File) {
        // Default number of pages for an attachment
        let pages = 1

        // Stored Filename will become UUID.extension
        const storedFileName = `${uuidv4()}.${mime.extension(file.type)}`

        // If it's a PDF, we need to count the number of pages
        if (file.type === 'application/pdf') {
            pages = await countPages(file)
        }

        if (!state.request || !state.request.id) {
            return false
        }

        try {
            const filePath = `jobs/${state.request.id}/${storedFileName}`

            const { data, error } = await supabase.storage
                .from('attachments')
                .upload(filePath, file)

            if (error) {
                throw error
            }

            const { publicURL, error: publicError } = supabase.storage
                .from('attachments')
                .getPublicUrl(filePath)

            if (publicError || !publicURL) {
                throw publicError
            }

            if (state.request && state.request.id) {
                const newAttachment = new Attachment({
                    request_id: state.request.id,
                    user_id: rootGetters['supabaseAuth/authUser'].id,
                    url: publicURL,
                    mime: null,
                    pages: pages,
                    label: ''
                })
                const status = await newAttachment.insert()
                await dispatch('getById', state.request.id)
            }

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    async deleteAttachment({ state, commit, dispatch }, attachment) {
        // Get the filename from the Google Storage URL
        const url = new URL(attachment.url)
        const path = decodeURIComponent(url.pathname)
        const filename = path.replace(/.*\//, '')

        if (!state.request || !state.request.id) {
            return false
        }

        const filePath = `jobs/${state.request.id}/${filename}`

        try {

            const { data, error } = await supabase.storage
                .from('attachments')
                .remove([filePath])

            if (error) {
                throw error
            }

            const result = await attachment.delete()

            if (result === false) {
                throw 'attachment was deleted but record was not.'
            }

            await dispatch('getById', state.request.id)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
}

/**
 * Counts the pages of a PDF file
 */
const countPages = (pdf: File): Promise<number> => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
        }

        reader.onloadend = () => {
            if (reader && reader.result && reader.result! instanceof ArrayBuffer) {
                let result = new String(reader.result)
                const matches = result.match(/\/Type[\s]*\/Page[^s]/g)
                if (matches !== null) {
                    resolve(matches.length)
                }
            }
            resolve(1)

        }
        reader.readAsText(pdf)
    })
}