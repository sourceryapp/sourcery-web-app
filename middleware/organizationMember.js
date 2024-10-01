export default defineNuxtRouteMiddleware(async (to, from) => {
    const { authUser, fetchUserMetadata, userOrgsAndMembers } = useAuthUser()

    await callOnce(fetchUserMetadata)

    if (authUser.value?.admin === true) {
        return
    }

    // If the user is an owner of an organization that matches the id in the route, allow access.
    if (!userOrgsAndMembers.value.map(ou => "" + ou.id).includes(to.params.id)) {
        return navigateTo('/dashboard')
    }
    
})