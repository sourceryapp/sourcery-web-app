export default defineNuxtRouteMiddleware(async (to, from) => {
    const { fulfilling } = useChangeModes()

    if ( !fulfilling.value ) {
        return navigateTo('/research')
    }
})