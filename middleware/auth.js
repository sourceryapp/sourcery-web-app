const config = require('~/nuxt.config.js')
export default function ({ store, redirect, route, error, app }) {
    console.group('Authentication Middleware - auth.js')
    console.info('Current user data:', store.getters['auth/activeUser'])

    if (!store.getters['auth/activeUser'] && (!config.noAuth.includes(route.path))) {
        console.warn('User not logged in. Redirecting')
        return redirect('/login')
    } else {
        console.info('User is logged in or visiting the login page')
    }
    console.groupEnd()
}
