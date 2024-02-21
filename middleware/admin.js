/**
 * Defines a middleware that verifies a user is an admin.
 */
export default defineNuxtRouteMiddleware((to, from) => {
    const { authUser } = useAuthUser()

    if (!authUser.value?.admin !== true) {
        return abortNavigation()
    }
})