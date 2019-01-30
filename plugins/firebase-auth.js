import { Auth } from '@/services/firebase-client-init.js'

export default (context) => {
    const { store } = context

    return new Promise((resolve, reject) => {
        Auth.onAuthStateChanged(user => {
            store.commit('setUser', user)
            resolve()
        })
    })
}
