export default function ({ store, error }) {
    if (!store.state.auth.authUser.admin) {
        error('Forbidden')
    }
}
