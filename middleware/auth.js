export default function ({ store, redirect, route, error }) {
    if (!store.getters.activeUser && (route.path !== '/login')) {
        console.log("User not logged in");
        return redirect('/login')
    }
}
