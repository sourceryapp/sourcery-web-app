/**
 * Responsible for any functionality around searching/querying for REAL requests.
 * This does not include the prospective requests (URI).
 */
export function useRequestSearch() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const route = useRoute()

    const orderOptions = ref([
        { value: 'newest', title: 'Newest' },
        { value: 'oldest', title: 'Oldest' }
    ])

    const defaultSort = ref('newest')
    const debounceMilliseconds = ref(500)
    const limit = ref(30)
    const organizationId = ref(route.query.organization_id || null)
    const owned = ref(true)

    const requests = ref([])
    const search = ref(route.query.search || '')

    // Assign the first UI filters/sorting/input from query parameters.
    const selectedStatus = ref(route.query.status
        ? (Array.isArray(route.query.status)
            ? route.query.status.map(x=>parseInt(x))
                : [parseInt(route.query.status)])
            : [])
    const order = ref(route.query.order || defaultSort.value)

    let requests_query = `
            *,
            request_clients (*),
            request_vendors (*)
        `;

    // Loading & debounce state
    const loading = ref(false)
    const queuedJob = ref(null)

    async function fetchRequests() {
        loading.value = true

        // Chaining multiple OR statements from referenced/joined postgres is tricky (and hard to accomplish with supabase-js) so instead we filter the joined results and then OR the existence of them or not, with any core table search filters.
        let query = supabase.from('requests').select(getRequestsQuery())
            .range(0, limit.value)
            .neq('deleted', true)

        // Only search on requests that are owned by the requesting user.
        if ( owned.value ) {
            query = query.or('user_id.eq.' + user.value.id + ',servicer_id.eq.' + user.value.id)
        }

        // Apply the search query if necessary
        if ( search.value ) {
            query = query.or(`citation.ilike.%${search.value}%,original_title.ilike.%${search.value}%`)
        }
        if ( selectedStatus.value && selectedStatus.value.length ) {
            query = query.in('status_id', selectedStatus.value)
        }
        if ( organizationId.value ) {
            query = query.eq('repository.organization_id', organizationId.value)
        }

        switch(order.value) {
            case 'oldest':
                query = query.order('created_at', { ascending: true })
                break
            default:
                query = query.order('created_at', { ascending: false })
                break
        }
        const { data: queryData, error: queryError } = await query

        if ( !queryError ) {

            let newquery = supabase.from('requests').select(`
                *,
                status (*),
                repository:repositories (
                    *,
                    organization:organizations (*)
                ),
                request_client:request_clients (*),
                request_vendor:request_vendors (*)
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
                // router.replace({
                //     path: '/requests',
                //     query: new_url_params
                // })
            }
        }

        loading.value = false
    }

    // Create our own fetch wrapper so we can debounce it.
    function onModelChange() {
        if ( queuedJob.value ) {
            clearTimeout(queuedJob.value)
        }

        queuedJob.value = setTimeout(() => {
            fetchRequests()
        }, debounceMilliseconds.value)
    }


    // In the case of an org dashboard - we need an inner join.
    // Otherwise, we can ignore the inner join in order to show 'unassigned' requests.
    function getRequestsQuery() {
        let requests_query = '*, request_clients (*),request_vendors (*)'

        if ( selectedStatus.value && selectedStatus.value.length ) {
            requests_query += ',status!inner (*)'
        } else {
            requests_query += ',status (*)'
        }

        if ( organizationId.value ) {
            return requests_query + ',repository:repositories!inner (*, organization:organizations!inner (*))'
        } else {
            return requests_query + `repository:repositories (*, organization:organizations (*))`
        }
    }


    const hasQuery = computed(() => {
        return search.value || selectedStatus.value.length
    })

    return {
        requests,
        search,
        defaultSort,
        limit,
        owned,
        selectedStatus,
        organizationId,
        order,
        orderOptions,
        loading,
        debounceMilliseconds,
        hasQuery,
        fetchRequests,
        onModelChange
    }
}