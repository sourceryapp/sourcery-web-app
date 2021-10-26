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
                displayName: authUser.displayName,
                admin: authUser.admin,
                hasPassword: authUser.hasPassword,
                hasRequests: authUser.hasRequests
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
    },

    SET_AUTH_USER_HAS_PASSWORD: (state) => {
        if (state.authUser) {
            state.authUser.hasPassword = true
        }
    },

    SET_AUTH_USER_HAS_REQUESTS: (state) => {
        if (state.authUser) {
            state.authUser.hasRequests = true
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

            // An attempt to detect if a user is an admin.
            // No intention for this information to be used outside of 'dev helpers' on frontend.
            // Also detect password status for account.
            try {
                const admin = await this.$fire.firestore.collection('admins').doc(authUser.email).get()
                if (admin.exists) {
                    authUser.admin = true
                }

                authUser.hasPassword = false

                try {
                    const methods = await this.$fire.auth.fetchSignInMethodsForEmail(authUser.email)
                    if (methods.includes(this.$fireModule.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)) {
                        // Has a password.
                        authUser.hasPassword = true
                    }
                    // if (methods.includes(this.$fireModule.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)) {
                    //     // Has passwordless login.
                    // }
                } catch (error) {
                    console.log(error)
                }

                const req = await this.$fire.firestore.collection('requests').where('client_id', '==', authUser.uid).limit(1).get()
                if (req.docs && req.docs.length > 0) {
                    authUser.hasRequests = true
                } else {
                    authUser.hasRequests = false
                }
            } catch (e) {
                console.error(e)
            }
        }
        if (authUser) {
            console.log('Setting user', authUser)
            commit('SET_AUTH_USER', { authUser })
        }

        console.groupEnd()
    }
}
