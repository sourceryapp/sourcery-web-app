export default function ({ store, redirect, route, $config }) {
    // Is the user logged in?
    const isLoggedIn = store.getters['auth/isLoggedIn']

    // Begin logging for auth-guard
    console.group('/middleware/auth-guard.js')
    console.info('User is authenticated?:', isLoggedIn)

    // Redirect a logged in user to dashboard.  This is so we can link directly to login page since dashboard is public.
    if (isLoggedIn && route.path === '/login') {
        return redirect('/dashboard')
    }

    const isOrganizationPage = route.path.startsWith('/o/')

    // If the user isn't logged in
    if (
        !isLoggedIn &&
        !$config.publicPaths.includes(route.path) &&
        !isOrganizationPage
    ) {
        console.warn('User not logged in. Redirecting')
        console.groupEnd()
        return redirect('/login')
    }

    const isSupabaseAuthenticated = store.getters['supabase/isAuthenticated']
    if (!isSupabaseAuthenticated && $config.supabasePrivatePaths.includes(route.path)) {
        console.warn('Supabase Not Authenticated, Log in with Supabase')
        console.groupEnd()
        return redirect('/login/supabase')
    }

    console.info('User is logged in or visiting a public page')
    console.groupEnd()
}
