import { Auth, GoogleAuthProvider } from '~/plugins/firebase-client-init.js'
import Cookies from 'js-cookie'
import { Utils } from '~/modules/utilities.js';

export const state = () => ({
    user: null,
    loading: false
});

export const getters = {
    activeUser: (state, getters) => {
        return state.user
    },
    isLoading: (state, getters) => {
        return state.loading
    }
};

export const mutations = {
    setUser(state, payload) {
        state.user = payload;
    },
    setLoading(state, payload) {
        state.loading = payload
    }
};

export const actions = {
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
};
