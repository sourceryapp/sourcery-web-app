export default function ({ store, redirect, route, $config }) {
    const isOrganizationPage = route.path.startsWith('/o/')

    const isSupabaseAuthenticated = store.getters['supabaseAuth/isAuthenticated']

    if (isSupabaseAuthenticated && route.path === '/login') {
        return redirect('/dashboard')
    }

    // If the user isn't logged in
    if (
        !isSupabaseAuthenticated &&
        !$config.publicPaths.includes(route.path) &&
        !isOrganizationPage
    ) {
        return redirect('/login')
    }
}
