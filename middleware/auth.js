export default function ({ store, redirect, route, error }) {
    console.group('Authentication Middleware - auth.js');
    console.info('Current user data:', store.getters['auth/activeUser']);

    if (!store.getters['auth/activeUser'] && (route.path !== '/login') && (route.path !== '/register') && (route.path !== '/password') && (route.path !== '/resetpassword')) {
        console.warn("User not logged in. Redirecting");
        return redirect('/login')
    }else{
        console.info("User is logged in or visiting the login page");
    }
    console.groupEnd();
}
