export function useFetchRequest() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const route = useRoute()

    const request = ref(null)
    const requestId = ref(route.params.id ?? null)

    // This function defaults to the request ID parameter in the route, but can be called with a different ID.
    async function fetchRequest() {
        const { data, error } = await supabase.from('requests').select(`
            *,
            status (*),
            repository:repositories (
                *,
                organization:organizations (*)
            ),
            request_clients(*),
            request_vendors(*)
        `).order('created_at', { ascending: false })
            .eq('id', requestId.value)
            .single()

        if ( !error ) {
            request.value = data
        }
    }

    return {
        request,
        requestId,
        fetchRequest
    }
}