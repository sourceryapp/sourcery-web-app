export default function ({ store, redirect, route, error }) {
    console.info('Auth Middleware Running', process.server ? "Server" : "Client", store.getters['auth/activeUser']);

    if (!store.getters['auth/activeUser'] && (route.path !== '/login') && (route.path !== '/register') && (route.path !== '/password') && (route.path !== '/resetpassword')) {
        console.warn("User not logged in. Redirecting");
        return redirect('/login')
    }
}
