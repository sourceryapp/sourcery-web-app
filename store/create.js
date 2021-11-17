// Request/job States
const DRAFT = 'draft'
const PENDING = 'pending'
const PICKED_UP = 'picked_up'
const ARCHIVED = 'archived'
const RESERVED = 'reserved'
const COMPLETE = 'complete'

/**
 * Any properties for the initial state should be added
 * to this function.
 * Example: @url https://tahazsh.com/vuebyte-reset-module-state
 */
const initialState = () => {
    return {
        attachments: [],
        citation: '',
        client_id: '',
        created_at: null,
        label: '',
        pages: 0,
        pricing: {},
        repository: {},
        repository_id: null,
        status: 'pending',
        vendor_id: '',
        archiveOrigin: false,
        archiveOrg: null
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

    /**
     * Get an item by key
     */
    getItem: (state, getters) => key => state[key],

    /**
     * Is the current request complete
     */
    isDraft: (state, getters) => state.status === DRAFT,

    /**
     * Is the current request complete
     */
    isComplete: (state, getters) => state.status === COMPLETE,

    /**
     * Is the current request pending
     */
    isPending: (state, getters) => state.status === PENDING,

    /**
     * Is the current request picked up
     */
    isPickedUp: (state, getters) => state.status === PICKED_UP,

    /**
     * Is the current request archived
     */
    isArchived: (state, getters) => state.status === ARCHIVED,

    /**
     * Is the current request reserved for an Org Account
     */
    isReserved: (state, getters) => state.status === RESERVED,

    /**
     * Returns a human-readable version of status
     */
    prettyStatus: (state, getters) => {
        const str = state.status.replace('_', ' ')
        const s = str.split(' ')
        for (let i = 0; i < s.length; i++) {
            s[i] = s[i][0].toUpperCase() + s[i].substr(1)
        }
        return s.join(' ')
    },

    /**
     * This is just a utility function to determine whether the
     * given repo is from a member organization
     */
    isMemberRepo: (state, getters) => repo =>
        //  TODO Remove hard-coded organization values in production
        //  TODO Remove hasOwnProperty()
        /* eslint no-prototype-builtins: "off" */
        ((repo.hasOwnProperty('organization') && repo.organization !== null) || repo.institution === 'UConn' || repo.institution === 'Northeastern University')

}

/**
 * Remember that Mutations MUST be synchronous functions.
 * Use Actions for async data
 */
export const mutations = {

    setCitation (state, value) {
        state.citation = value
    },
    setPages (state, value) {
        state.pages = Number(value)
    },
    setRepositoryId (state, value) {
        state.repository_id = value
    },
    setLabel (state, value = false) {
    // Set the label to the given value or as a truncated citation
        state.label = value || state.citation.match(/^(\w(\s|\.|\(|\))*)+/)[0].trim()
    },
    setStatusDraft (state) {
        state.status = DRAFT
    },
    setStatusPending (state) {
        state.status = PENDING
    },
    setStatusPickedUp (state) {
        state.status = PICKED_UP
    },
    setStatusArchived (state) {
        state.status = ARCHIVED
    },
    setStatusReserved (state) {
        state.status = RESERVED
    },
    setStatusComplete (state) {
        state.status = COMPLETE
    },
    reset (state) {
        const s = initialState()
        Object.keys(s).forEach((key) => {
            state[key] = s[key]
        })
    },
    setRepository (state, val) {
        state.repository = val
        if (val.id) {
            state.repository_id = val.id
        }
    },
    setArchiveOrigin (state) {
        state.archiveOrigin = true
    },
    setArchiveOrg (state, value) {
        state.archiveOrg = value
    },
    cleanArchive (state) {
        state.archiveOrigin = false
        state.archiveOrg = null
        state.citation = ''
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

    /**
     * Delete current request
     */
    // delete: ({state, commit, dispatch}) => $fire.firestore.collection('requests').doc(state.id).delete(),
    async insert ({ state, commit, dispatch, rootGetters }) {
        // Generate a label for the request
        commit('setLabel')

        // Created now
        state.created_at = new Date()

        // Repository Object
        state.repository = await dispatch('getRepositoryById', state.repository_id)

        // Client ID of current user
        state.client_id = rootGetters['auth/activeUser'].uid

        // If a member repo, set to picked_up by the vendor
        if ((rootGetters['create/isMemberRepo'](state.repository)) || state.archiveOrigin) {
            // Set as picked_up
            commit('setStatusPickedUp')

            // Set the vendor_id
            if (state.archiveOrigin) { state.vendor_id = await dispatch('getOrganizationUser', state.archiveOrg) } else { state.vendor_id = await dispatch('getOrganizationUser', state.repository.organization) }
        }
        return this.$fire.firestore.collection('requests').add(state)
    },

    getRepositoryById ({ state, commit, dispatch }, id) {
        return this.$fire.firestore.collection('repositories').doc(id).get().then((doc) => {
            if (doc.exists) {
                return doc.data()
            } else {
                return {}
            }
        })
    },

    getOrganizationUser ({ state, commit, dispatch }, orgId) {
        return this.$fire.firestore.collection('organization').doc(orgId).get().then((doc) => {
            return doc.data().owner
        })
    }
}
