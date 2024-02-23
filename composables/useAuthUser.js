/**
 * Allows the use of useAuthUser() in nuxt files, accessing the metadata of the current logged in user.
 * Returns a reactive ref of the user's metadata.
 */
export const useAuthUser = async () => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    // Attach to useAsyncData so we can leverage caching
    const { data: authUser, error, execute, pending, refresh, status } = await useAsyncData('authUser', async () => {
        if (!user.value) {
            return null
        }

        console.log('fetching new')
        const { data } = await supabase.from('user').select('*').eq('id', user.value.id).single()
        
        return data
    },
    // AsyncDataOptions, watcher is necessary to update the result reactively to templates.
    // getCachedData is necessary to get the data from the cache if it exists.
    {
        watch: [user],
        getCachedData: key => {
            const cachedUser = useNuxtData(key).data
            if ( cachedUser.value ) {
                console.log('returning from cache')
                return cachedUser
            }
        }
    })

    return {
        authUser,
        refresh
    }
}