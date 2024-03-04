export function useFetchUriRequests() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    const requests = ref([])
    const requestCount = ref(0)

    async function fetchUriRequests() {
        const { data, error } = await supabase.from('requests_prospective')
            .select(`*`)
            .order('created_at', { ascending: false })
            .eq('user_id', user.value.id)
            .eq('converted', false)
            .eq('deleted', false)
            .range(0, 30)

        if ( !error ) {
            requests.value = data
        }

        return
    }

    async function countUriRequests() {
        const { count, error } = await supabase.from('requests_prospective')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.value.id)
            .eq('deleted', false)
            .eq('converted', false)

        if ( !error ) {
            requestCount.value = count
        }

        return
    }

    return {
        requests,
        requestCount,
        fetchUriRequests,
        countUriRequests
    }
}