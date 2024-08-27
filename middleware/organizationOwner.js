export default defineNuxtRouteMiddleware(async (to, from) => {
    const { authUser, fetchUserMetadata, isOrgOwner, ownsOrg } = useAuthUser()

    await callOnce(fetchUserMetadata)

    if (authUser.value?.admin === true) {
        return
    }

    // If the user is an owner of an organization that matches the id in the route, allow access.
    if (!ownsOrg(to.params.id)) {
        return navigateTo('/dashboard')
    }
    
})