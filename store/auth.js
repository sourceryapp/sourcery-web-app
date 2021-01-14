import Cookies from 'js-cookie'

// user props:  { uid, displayName, photoURL, email, emailVerified, phoneNumber }
const initialState = () => {
    return {
        user: null,
        loading: false
    }
}

export const state = initialState

export const getters = {
    activeUser: (state, getters) => {
        return state.user
    },
    isLoading: (state, getters) => {
        return state.loading
    }
}

export const mutations = {
    setUser (state, payload) {
        state.user = payload
    },
    setLoading (state, payload) {
        state.loading = payload
    },
    reset (state) {
        const s = initialState()
        Object.keys(s).forEach((key) => {
            state[key] = s[key]
        })
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
    async signInWithGooglePopup ({ commit }) {
        commit('setLoading', true)
        const authData = await Auth.signInWithPopup(GoogleAuthProvider)
        commit('setUser', Auth.currentUser)
        commit('setLoading', false)
    },

    async signIn ({ commit }, { email, password }) {
        commit('setLoading', true)
        const authData = await Auth.signInWithEmailAndPassword(email, password)
        const token = await Auth.currentUser.getIdToken(true)
        Cookies.set('token', token)
        commit('setUser', Auth.currentUser)
        commit('setLoading', false)
        return 'Someone'
    },

    async signOut ({ commit, rootState }) {
        await Auth.signOut()
        Cookies.remove('token')
        Cookies.remove('user')
        commit('reset') // auth/reset

        // Also reset meta store for this user
        commit('meta/reset', null, { root: true })
    }
}
