export default function ({ store, redirect, route, $config, error }) {
    if (!store.state.auth.authUser.admin) {
        error('Forbidden')
    }
}
