// authUser props:  { uid, displayName, photoURL, email, emailVerified, phoneNumber }
const initialState = () => {
    return {
        authUser: null
    }
}

export const state = initialState

export const getters = {
    isLoggedIn: (state) => {
        try {
            return state.authUser.uid !== null
        } catch {
            return false
        }
    },

    activeUser: (state) => {
        return state.authUser
    }
}

export const mutations = {
    RESET_STORE: (state) => {
        Object.assign(state, initialState())
    },

    SET_AUTH_USER: (state, { authUser }) => {
        if (authUser) {
            console.log('SET_AUTH_USER called', authUser)
            state.authUser = {
                uid: authUser.uid,
                email: authUser.email,
                photoURL: authUser.photoURL,
                displayName: authUser.displayName
            }
        }
    },

    ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
        console.group('ON_AUTH_STATE_CHANGED_MUTATION')
        console.info('User/Claims', authUser, claims)
        if (!authUser) {
            console.log('User not authenticated')

            // claims = null
            // perform logout operations
        } else {
            console.log('User authenticated!')
            // Do something with the authUser and the claims object...
        }
        console.groupEnd()
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
    async onAuthStateChanged ({ commit }, { authUser }) {
        console.group('onAuthStateChanged')
        if (!authUser) {
            console.log('Resetting auth store')
            commit('RESET_STORE')
            console.groupEnd()
            return
        }
        if (authUser && authUser.getIdToken) {
            try {
                const idToken = await authUser.getIdToken(true)
                console.info('idToken', idToken)
            } catch (e) {
                console.error(e)
            }
        }
        if (authUser) {
            console.log('Setting user', authUser)
            commit('SET_AUTH_USER', { authUser })
        }

        console.groupEnd()
    },

    /**
     * Is the current user an admin?
     *
     * @param {*} { commit }
     * @param {*} { authUser }
     */
    async isAdmin ({ state, commit }) {
        if (state.authUser !== null) {
            let doc
            try {
                doc = await this.$fire.firestore.collection('admins').doc(state.authUser.email).get()
                return doc.exists
            } catch (error) {
                console.error(error)
            }
        } else {
            return false
        }
    }
}
