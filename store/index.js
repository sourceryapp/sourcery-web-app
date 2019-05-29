import Vuex from 'vuex'
import { Auth, GoogleAuthProvider } from '~/plugins/firebase-client-init.js'
import Cookies from 'js-cookie'
import cookieParser from 'cookieparser'
import jwt_decode from 'jwt-decode'

Auth.onAuthStateChanged(firebaseUser => {
    console.log("User state changed", firebaseUser);
})

export function getUserFromSession(req) {
    console.log('[CHECK-AUTH] - checking if user is stored in session')
    return req.session ? req.session.userId : null
}
// function buildUserObject(authData) {
//     let { email, displayName, uid, photoURL } = authData.user
//     let user = {}
//     user['email'] = email
//     user['name'] = displayName
//     user['uid'] = uid
//     user['picture'] = photoURL
//     return user
// }

const createStore = () => {
    return new Vuex.Store({
        state: {
            user: null,
            loading: false
        },

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
                state.user = Auth.currentUser;
                // state.user = Object.assign(state.user || {}, payload);
            },
            setLoading(state, payload) {
                state.loading = payload
            }
        },

        actions: {
            async nuxtServerInit({ commit }, { req }) {
                if (!req.headers.cookie) return

                if (req.headers.cookie) {
                    const parsed = cookieParser.parse(req.headers.cookie)

                    if(parsed.token){

                        console.log("Parsing user data from JWT");
                        const { user_id, email } = jwt_decode(parsed.token);


                        commit('setUser', {
                            email: email,
                            uid: user_id,
                        })

                        // console.log(jwt_decode(parsed.token));

                    }

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
                commit('setUser', null)
            }
        }
    })
}

export default createStore
