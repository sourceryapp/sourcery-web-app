/**
 * Allows the use of useAuthUser() in nuxt files, accessing the metadata of the current logged in user.
 * Returns a reactive ref of the user's metadata.
 */
export const useAuthUser = async () => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    // Attach to useAsyncData so we can leverage caching
    // TODO: implement getCacheKey
    const { data: authUser } = await useAsyncData('authUser', async () => {
        if (!user.value) {
            return null
        }
        const { data } = await supabase.from('user').select('*').eq('id', user.value.id).single()
        
        return data
    },
    // AsyncDataOptions, watcher is necessary to update the result reactively to templates.
    {
        watch: [user]
    })

    return authUser
}