export default function ({ store, redirect, route, error }) {
    if (!store.getters.activeUser && (route.path !== '/login') && (route.path !== '/import')) {
        console.log("User not logged in");
        return redirect('/login')
    }
}
