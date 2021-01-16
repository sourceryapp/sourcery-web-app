export default function ({ store, redirect, route, $config }) {
    // Is the user logged in?
    const isLoggedIn = store.getters['auth/isLoggedIn']

    // Begin logging for auth-guard
    console.group('/middleware/auth-guard.js')
    console.info('User is authenticated?:', isLoggedIn)

    // If the user isn't logged in
    if (!isLoggedIn && !$config.publicPaths.includes(route.path)) {
        console.warn('User not logged in. Redirecting')
        console.groupEnd()
        return redirect('/login')
    } else {
        console.info('User is logged in or visiting a public page')
        console.groupEnd()
    }
}
