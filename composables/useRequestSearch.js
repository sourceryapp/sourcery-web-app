export function useRequestSearch() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const route = useRoute()
    const router = useRouter()

    const defaultSort = 'newest'

    const requests = ref([])
    const search = ref(route.query.search || '')

    const selectedStatus = ref(route.query.status ? (Array.isArray(route.query.status) ? route.query.status.map(x=>parseInt(x)) : [parseInt(route.query.status)]) : [])
    const order = ref(route.query.order || defaultSort)

    const loading = ref(false)
    const queuedJob = ref(null)

    async function fetchRequests() {
        loading.value = true

        // Chaining multiple OR statements from referenced/joined postgres is tricky (and hard to accomplish with supabase-js) so instead we filter the joined results and then OR the existence of them or not, with any core table search filters.
        let query = supabase.from('requests').select(`
            *,
            status (*),
            repository:repositories (*),
            request_clients (*),
            request_vendors (*)
        `)
            .eq('user_id', user.value.id)
            .range(0, 30)

        // Apply the search query if necessary
        if ( search.value ) {
            query = query.ilike('repository.name', `%${search.value}%`)
                .ilike('request_clients.label', `%${search.value}%`)
                .ilike('request_vendors.label', `%${search.value}%`)
                .or(`citation.ilike.%${search.value}%,repository.not.is.null,request_clients.not.is.null,request_vendors.not.is.null`)
        }

        if ( selectedStatus.value && selectedStatus.value.length ) {
            query = query.in('status_id', selectedStatus.value)
        }

        const { data: queryData, error: queryError } = await query

        if ( !queryError ) {

            let newquery = supabase.from('requests').select(`
                *,
                status (*),
                repository:repositories (*),
                request_clients (*),
                request_vendors (*)
            `).in('id', queryData.map(request => request.id))

            switch(order.value) {
                case 'oldest':
                    newquery = newquery.order('created_at', { ascending: true })
                    break
                default:
                    newquery = newquery.order('created_at', { ascending: false })
                    break
            }

            const { data, error } = await newquery;

            if ( !error ) {
                requests.value = data;

                const new_url_params = {}
                if ( search.value ) {
                    new_url_params.search = search.value
                }
                if ( selectedStatus.value.length ) {
                    new_url_params.status = selectedStatus.value
                }
                if ( order.value && order.value !== defaultSort ) {
                    new_url_params.order = order.value
                }

                // Silently replace this page in the current browser history stack
                router.replace({
                    path: '/requests',
                    query: new_url_params
                })
            }
        }

        loading.value = false
    }

    function onModelChange() {
        if ( queuedJob.value ) {
            clearTimeout(queuedJob.value)
        }

        queuedJob.value = setTimeout(() => {
            fetchRequests()
        }, 500)
    }

    return {
        requests,
        search,
        selectedStatus,
        order,
        loading,
        fetchRequests,
        onModelChange
    }
}