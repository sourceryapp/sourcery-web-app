import { db, storage, FieldValue } from "~/plugins/firebase-client-init.js";


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
        status: "pending",
        vendor_id: '',
    }
}

/**
 * The initial state uses the initialState() function
 */
export const state = initialState;


/**
 * Getters for our metadata
 */
export const getters = {

    /**
     * Get an item by key
     */
    getItem: (state, getters) => (key) => state[key],

    /**
     * Is the current request complete
     */
    isDraft: (state, getters) => state.status === 'draft',

    /**
     * Is the current request complete
     */
    isComplete: (state, getters) => state.status === 'complete',

    /**
     * Is the current request pending
     */
    isPending: (state, getters) => state.status === 'pending',

    /**
     * Is the current request picked up
     */
    isPickedUp: (state, getters) => state.status === 'picked_up',

    /**
     * Is the current request picked up
     */
    isArchived: (state, getters) => state.status === 'archived',

    /**
     * Returns a human-readable version of status
     */
    prettyStatus: (state, getters) => state.status.replace('_', ' ')

}

/**
 * Remember that Mutations MUST be synchronous functions.
 * Use Actions for async data
 */
export const mutations = {

    setCitation(state, value){
        state.citation = value
    },
    setPages(state, value){
        state.pages = Number(value);
    },
    setRepositoryId(state, value){
        state.repository_id = value;
    },
    setLabel(state, value=false){
        /**
         * Set the label to the given value or as a truncated citation
         */
        state.label = value ? value : state.citation.match(/^(\w(\s*))+/)[0];
    },


    reset(state) {
        const s = initialState()
        Object.keys(s).forEach(key => {
            state[key] = s[key]
        })
    },

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
    // delete: ({state, commit, dispatch}) => db.collection('requests').doc(state.id).delete(),
    insert: async ({state, commit, dispatch, rootGetters}) => {

        // Generate a label for the request
        commit('setLabel');

        // Created now
        state.created_at = new Date();

        // Repository Object
        state.repository = await dispatch('getRepositoryById', state.repository_id);

        // Client ID of current user
        state.client_id = rootGetters['auth/activeUser'].uid;

        return db.collection("requests").add(state);

    },

    getRepositoryById: ({state, commit, dispatch}, id) => {
        return db.collection('repositories').doc(id).get().then((doc) => {
            return doc.data();
        });
    },
}

