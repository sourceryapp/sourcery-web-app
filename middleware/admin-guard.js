export default async function ({ store, redirect, route, $config, error }) {
    let isAdmin

    try {
        isAdmin = await store.dispatch('auth/isAdmin')
    } catch (error) {
        console.error(error)
    }

    if (!isAdmin) {
        error('Forbidden')
    }
}
