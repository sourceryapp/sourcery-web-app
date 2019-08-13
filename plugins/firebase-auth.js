import { Auth } from '~/plugins/firebase-client-init.js'

export default (context) => {
    const { store } = context

    return new Promise((resolve, reject) => {
        Auth.onAuthStateChanged(user => {
            console.log("User state changed", user);
            store.commit('auth/setUser', user)
            resolve()
        })
    })
}
