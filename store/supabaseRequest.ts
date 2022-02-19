import { Request } from '~/models/Request'
import type { Commit, Dispatch, ActionTree, GetterTree, MutationTree } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
import { Attachment } from '~/models/Attachment'
import { SupabaseState } from '~/store/supabaseAuth'

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
    id(state : SupabaseRequestState) {
        return (state.request) ? state.request.id : null
    },
    isComplete(state: SupabaseRequestState) {
        return state.request?.status?.name === 'Complete'
    },
    isPickedUp(state: SupabaseRequestState) {
        return state.request?.status?.name === 'Picked Up'
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


export const mutations : MutationTree<SupabaseRequestState> = {
    set(state: SupabaseRequestState, value: Request) {
        state.request = value
    },
    clear(state: SupabaseRequestState) {
        state = initialState()
    }
}

export const actions : ActionTree<SupabaseRequestState, SupabaseRequestState> = {
    async getById({ commit }: { commit: Commit }, id : string) {
        const r = await Request.getById(id)
        commit('set', r)
        return true
    },
    async cancel({ state, commit }: { state: SupabaseRequestState, commit: Commit }) {
        if ( state.request ) {
            const deleted = await state.request.cancel()
            if ( deleted ) {
                commit('clear')
                return true
            }
        }
        return false
    },
    async archive({ state }: { state: SupabaseRequestState }) {
        if ( state.request ) {
            const archived = await state.request.archive()
            if ( archived ) {
                return true
            }
        }
        return false
    },
    async complete({ state }: { state: SupabaseRequestState }) {
        if ( state.request ) {
            const completed = await state.request.complete()
            if ( completed ) {
                return true
            }
        }
        return false
    },
    async addAttachment ({ state, commit, dispatch, rootGetters } : { state: SupabaseRequestState, commit: Commit, dispatch: Dispatch, rootGetters : any}, file : File) {
        // Default number of pages for an attachment
        let pages = 1

        // Stored Filename will become UUID.extension
        const storedFileName = `${uuidv4()}.${mime.extension(file.type)}`

        // If it's a PDF, we need to count the number of pages
        if (file.type === 'application/pdf') {
            pages = await countPages(file)
        }

        return new Promise((resolve, reject) => {

            if ( !state.request || !state.request.id ) {
                reject('No current request.')
                return
            }

            const storageRef = this.$fire.storage.ref(
                `jobs/supa-${state.request.id}/images/`
            )
            const imageRef = storageRef.child(storedFileName)
            const uploadTask = imageRef.put(file)

            uploadTask.on(
                'state_changed',
                function (snapshot) {
                    // Update progress here... if you want
                },
                function (error) {
                    // @todo Handle upload error messages
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break

                    case 'storage/canceled':
                        // User canceled the upload
                        break
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break
                    }
                },
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref
                    .getDownloadURL()
                    // Upload completed successfully, now we can get the download URL
                    let url = ''
                    const pagesString = pages.toString()

                    if ( state.request && state.request.id ) {
                        url = downloadURL
                        const newAttachment = new Attachment({
                            request_id: state.request.id,
                            user_id: rootGetters['supabaseAuth/authUser'].id,
                            url: downloadURL,
                            mime: null,
                            pages: pages,
                            label: ''
                        })
                        const status = await newAttachment.insert()
                        await dispatch('getById', state.request.id)
                    }


                    // @url https://firebase.google.com/docs/storage/web/file-metadata#custom_metadata
                    const meta = {
                        contentDisposition: 'attachment',
                        customMetadata: {
                            pages: pagesString,
                            url
                        }
                    }

                    // Add the number of pages to the metadata
                    await imageRef
                        .updateMetadata(meta)
                        .then((metadata) => {
                            // Updated metadata for 'images/forest.jpg' is returned in the Promise
                            console.info('Added custom metadata to attachment')
                        })
                        .catch((error) => {
                            if (error) {
                                console.log('Request.js', error)
                            }
                        })

                    // Resolve this promise
                    resolve(url)
                    console.log(url)
                }
            )
        })
    },
    async deleteAttachment ({ state, commit, dispatch }, attachment) {
        // Get the filename from the Google Storage URL
        const url = new URL(attachment.url)
        const path = decodeURIComponent(url.pathname)
        const filename = path.replace(/.*\//, '')

        // Run the tasks
        return new Promise((resolve, reject) => {
            if ( !state.request || !state.request.id ) {
                reject('No current request.')
                return
            }
            const storageRef = this.$fire.storage.ref(
                `jobs/supa-${state.request.id}/images/`
            )
            const fileRef = storageRef.child(filename)

            const tasks = [
                // Delete the file
                fileRef.delete(),

                // Delete the db reference
                attachment.delete()
            ]

            Promise.all(tasks).then((values) => {
                if ( state.request ) {
                    dispatch('getById', state.request.id)
                }
                resolve(values)
            })
        })
    },
}

/**
 * Counts the pages of a PDF file
 */
 const countPages = (pdf : File) : Promise<number> => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
        }

        reader.onloadend = () => {
            if ( reader && reader.result && reader.result !instanceof ArrayBuffer ) {
                let result = new String(reader.result)
                const matches = result.match(/\/Type[\s]*\/Page[^s]/g)
                if ( matches !== null ) {
                    resolve(matches.length)
                }
            }
            resolve(1)
            
        }
        reader.readAsText(pdf)
    })
}