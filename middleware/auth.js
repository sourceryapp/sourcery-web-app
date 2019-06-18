export default function ({ store, redirect, route, error }) {
    console.info('Auth Middleware Running', process.server ? "Server" : "Client", store.getters.activeUser);

    if (!store.getters.activeUser && (route.path !== '/login') && (route.path !== '/register') && (route.path !== '/password') && (route.path !== '/resetpassword')) {
        console.warn("User not logged in. Redirecting");
        return redirect('/login')
    }
}
