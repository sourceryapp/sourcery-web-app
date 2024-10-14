export function useFetchUriRequests() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    const requests = ref([])
    const requestCount = ref(0)
    const page = ref(1)
    const limit = ref(30)

    async function fetchUserUriRequests() {
        const { data, error } = await supabase.from('requests')
            .select(`*`)
            .order('created_at', { ascending: false })
            .eq('user_id', user.value.id)
            .is('repository_id', null)
            .eq('deleted', false)
            .range((page.value - 1) * 30, limit.value)

        if ( !error ) {
            requests.value = data
        }

        return
    }

    async function fetchAllUriRequests() {
        const { data, error } = await supabase.from('requests')
            .select(`
                *,
                user!requests_user_id_fkey (*)
            `)
            .order('created_at', { ascending: false })
            .is('repository_id', null)
            .eq('deleted', false)
            .range((page.value - 1) * 30, limit.value)

        if ( !error ) {
            requests.value = data
        }

        return
    }


    async function countUriRequests() {
        const { count, error } = await supabase.from('requests')
            .select('*', { count: 'exact', head: true })
            .in('status', ['STATUS_CREATED'])
            .eq('user_id', user.value.id)
            .eq('deleted', false)
            .is('repository_id', null)

        if ( !error ) {
            requestCount.value = count
        }

        return
    }

    return {
        requests,
        page,
        limit,
        requestCount,
        fetchUserUriRequests,
        fetchAllUriRequests,
        countUriRequests
    }
}