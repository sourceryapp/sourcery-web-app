import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
/**
 * Any properties for the meta state should be added
 * to this function.
 * Example: @url https://tahazsh.com/vuebyte-reset-module-state
 */
const initialState = () => {
    return {
        // Stores the complete Firestore document object
        document: {
            id: null,
            userRating: 0
        }
    }
}

/**
 * The initial state uses the initialState() function
 */
export const state = initialState

/**
 * Getters for our metadata
 */
export const getters = {
    id: (state, getters) => {
        return state.document.id
    },
    data: (state, getters) => (state.document.id ? state.document.data() : {}),

    /**
     * Is the current request complete
     */
    isComplete: (state, getters) => getters.data.status === 'complete',

    /**
     * Is the current request pending
     */
    isPending: (state, getters) => getters.data.status === 'pending',

    /**
     * Is the current request picked up
     */
    isPickedUp: (state, getters) => getters.data.status === 'picked_up',

    /**
     * Is the current request picked up
     */
    isArchived: (state, getters) => getters.data.status === 'archived',

    /**
     * Returns a human-readable version of status
     */
    prettyStatus: (state, getters) => {
        const str = getters.data.status.replace('_', ' ')
        const s = str.split(' ')
        for (let i = 0; i < s.length; i++) {
            s[i] = s[i][0].toUpperCase() + s[i].substr(1)
        }
        return s.join(' ')
    }
}

/**
 * Remember that Mutations MUST be synchronous functions.
 * Use Actions for async data
 */
export const mutations = {
    reset (state) {
        const s = initialState()
        Object.keys(s).forEach((key) => {
            state[key] = s[key]
        })
    },
    set (state, doc) {
        state.document = doc
    }
}

/**
 * Available properties within actions
{
  state,      // same as `store.state`, or local state if in modules
  rootState,  // same as `store.state`, only in modules
  commit,     // same as `store.commit`
  dispatch,   // same as `store.dispatch`
  getters,    // same as `store.getters`, or local getters if in modules
  rootGetters // same as `store.getters`, only in modules
}
 */
export const actions = {
    init ({ state, commit, dispatch }, request_id) {
        // Get initial data
        this.$fire.firestore
            .collection('requests')
            .doc(request_id)
            .get()
            .then((doc) => {
                commit('set', doc)
            })
            .catch((error) => {
                error(error)
            })

        // Register a listener for updates
        this.$fire.firestore
            .collection('requests')
            .doc(request_id)
            .onSnapshot(doc => commit('set', doc))
    },
    async addAttachment ({ state, commit, dispatch }, file) {
        // Default number of pages for an attachment
        let pages = 1

        // Stored Filename will become UUID.extension
        const storedFileName = `${uuidv4()}.${mime.extension(file.type)}`

        // If it's a PDF, we need to count the number of pages
        if (file.type === 'application/pdf') {
            pages = await countPages(file)
        }

        return new Promise((resolve, reject) => {
            const storageRef = this.$fire.storage.ref(
                `jobs/${state.document.id}/images/`
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
                    let url
                    // Upload completed successfully, now we can get the download URL
                    await uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then((downloadURL) => {
                            url = downloadURL
                            this.$fire.firestore
                                .collection('requests')
                                .doc(state.document.id)
                                .update({
                                    attachments: this.$fireModule.firestore.FieldValue.arrayUnion(
                                        downloadURL
                                    )
                                })
                        })

                    // @url https://firebase.google.com/docs/storage/web/file-metadata#custom_metadata
                    const meta = {
                        contentDisposition: 'attachment',
                        customMetadata: {
                            pages,
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
    deleteAttachment ({ state, commit, dispatch }, file) {
        // Get the filename from the Google Storage URL
        const url = new URL(file)
        const path = decodeURIComponent(url.pathname)
        const filename = path.replace(/.*\//, '')

        // Run the tasks
        return new Promise((resolve, reject) => {
            const storageRef = this.$fire.storage.ref(
                `jobs/${state.document.id}/images/`
            )
            const fileRef = storageRef.child(filename)

            const tasks = [
                // Delete the file
                fileRef.delete(),

                // Delete the db reference
                this.$fire.firestore
                    .collection('requests')
                    .doc(state.document.id)
                    .update({
                        attachments: this.$fireModule.firestore.FieldValue.arrayRemove(
                            file
                        )
                    })
            ]

            Promise.all(tasks).then((values) => {
                resolve(values)
            })
        })
    },

    /**
     * Mark as complete
     */
    markComplete ({ state, commit, dispatch }) {
        return this.$fire.firestore
            .collection('requests')
            .doc(state.document.id)
            .update({ status: 'complete' })
    },

    /**
     * Archive current request
     */
    markArchived ({ state, commit, dispatch }) {
        return this.$fire.firestore
            .collection('requests')
            .doc(state.document.id)
            .update({ status: 'archived' })
    },

    /**
     * Delete current request
     */
    delete ({ state, commit, dispatch }) {
        return this.$fire.firestore
            .collection('requests')
            .doc(state.document.id)
            .delete()
    }
}

/**
 * Counts the pages of a PDF file
 */
const countPages = (pdf) => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
        }

        reader.onloadend = () => {
            resolve(reader.result.match(/\/Type[\s]*\/Page[^s]/g).length)
        }
        reader.readAsBinaryString(pdf)
    })
}
