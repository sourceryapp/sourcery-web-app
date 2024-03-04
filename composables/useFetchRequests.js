export function useFetchRequests() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    const requests = ref([])

    async function fetchRequests() {
        const { data, error } = await supabase.from('requests').select(`
            *,
            status (*),
            repository:repositories (*),
            request_clients(*),
            request_vendors(*)
        `).order('created_at', { ascending: false })
            .eq('user_id', user.value.id)
            .range(0, 30)

        if ( !error ) {
            requests.value = data
        }
    }

    return {
        requests,
        fetchRequests
    }
}