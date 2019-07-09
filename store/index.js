import Vuex from 'vuex'
import { Auth, GoogleAuthProvider } from '~/plugins/firebase-client-init.js'
import Cookies from 'js-cookie'
import { Utils } from '~/modules/utilities.js';

const createStore = () => {
    return new Vuex.Store({
        state: () => ({
            user: null,
            loading: false
        }),

        getters: {
            activeUser: (state, getters) => {
                return state.user
            },
            isLoading: (state, getters) => {
                return state.loading
            }
        },

        mutations: {
            setUser(state, payload) {
                state.user = payload;
            },
            setLoading(state, payload) {
                state.loading = payload
            }
        },

        actions: {
            async nuxtServerInit({ commit }, { req }) {
                console.log('nuxtServerInit Running')
                if (!req.headers.cookie) return

                if (req.headers.cookie) {
                    commit('setUser', Utils.getUserFromCookie(req.headers.cookie))
                }
            },

            async signInWithGooglePopup({ commit }) {
                commit('setLoading', true)
                let authData = await Auth.signInWithPopup(GoogleAuthProvider);
                commit('setUser', Auth.currentUser);
                commit('setLoading', false);
            },

            async signIn({ commit }, { email, password }) {
                commit('setLoading', true);
                let authData = await Auth.signInWithEmailAndPassword(email, password);
                const token = await Auth.currentUser.getIdToken(true)
                Cookies.set('token', token);
                commit('setUser', Auth.currentUser);
                commit('setLoading', false);
                return "Someone";
            },

            async signOut({ commit }) {
                await Auth.signOut()
                Cookies.remove('token');
                Cookies.remove('user');
                commit('setUser', null)
            }
        }
    })
}

export default createStore
