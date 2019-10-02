import { Auth } from '~/plugins/firebase-client-init.js'

export default (context) => {
    const { store } = context

    return new Promise((resolve, reject) => {
        Auth.onAuthStateChanged(user => {
            console.group('Auth State Callback - /plugins/firebase-auth.js')
            console.log("Saving user to Vuex store:", user);
            store.commit('auth/setUser', user)
            console.groupEnd();
            resolve()
        })
    })
}
