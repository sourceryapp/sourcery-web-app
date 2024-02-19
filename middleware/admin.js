export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    if (!user.value) {
        return abortNavigation()
    }

    const { data: authUser } = await useAsyncData('authUser', async () => {
        const { data } = await supabase.from('user').select('*').eq('id', user.value.id).single()
        
        return data
    })

    const isAdmin = authUser.value?.admin === true

    if (!isAdmin) {
        return abortNavigation()
    }
})