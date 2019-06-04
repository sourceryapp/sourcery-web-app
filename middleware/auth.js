export default function ({ store, redirect, route, error }) {
    // console.log('Current User:', store.getters.activeUser);
    if (!store.getters.activeUser && (route.path !== '/login') && (route.path !== '/register') && (route.path !== '/password') && (route.path !== '/resetpassword')) {
        console.log("User not logged in");
        return redirect('/login')
    }
}
