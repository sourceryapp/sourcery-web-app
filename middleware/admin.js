/**
 * Defines a middleware that verifies a user is an admin.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { authUser } = await useAuthUser()

    if (authUser.value?.admin !== true) {
        return abortNavigation()
    }
})