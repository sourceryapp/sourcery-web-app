export function useFetchStatus() {
    const supabase = useSupabaseClient()

    const statuses = ref([])

    async function fetchStatus() {
        const { data, error } = await supabase.from('status').select('*')

        if ( !error ) {
            statuses.value = data
        }
    }

    return {
        statuses,
        fetchStatus
    }

}