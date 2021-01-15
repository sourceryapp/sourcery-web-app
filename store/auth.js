// user props:  { uid, displayName, photoURL, email, emailVerified, phoneNumber }
const initialState = () => {
    return {
        user: null
    }
}

export const state = initialState

export const getters = {
    isLoggedIn: (state) => {
        try {
            return state.user.id !== null
        } catch {
            return false
        }
    }
}

export const mutations = {
    RESET_STORE: (state) => {
        Object.assign(state, initialState())
    },

    SET_AUTH_USER: (state, { user }) => {
        state.user = {
            uid: user.uid,
            email: user.email
        }
    },

    // @url https://firebase.nuxtjs.org/service-options/auth#onauthstatechangedmutation
    ON_AUTH_STATE_CHANGED_MUTATION: (state, { user, claims }) => {
        if (user) {
            // Populate user
            const { uid, email, emailVerified } = user
            state.user = { uid, email, emailVerified }
        } else {
            // Log user out
        }
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
    RESET_STORE: (state) => {
        Object.assign(state, initialState())
    },

    SET_AUTH_USER: (state, { user }) => {
        state.user = {
            uid: user.uid,
            email: user.email
        }
    }
}
