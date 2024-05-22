export default function useFetchRepositories() {
    const supabase = useSupabaseClient()
    const config = useRuntimeConfig()

    const repositories = useState('repositories', () => [])
    const fetchRepositoriesError = ref()

    async function fetchRepositories() {
        if ( repositories.value.length > 0 ) {
            return
        }
        const { data, error } = await supabase.from('repositories').select(`
            *,
            organization:organizations (*),
            featured_image:featured_images (*)
        `)
        .order('name')
        .eq('active', true)

        if ( config.public.SOURCERY_ENV === 'development' ) {
            const { data: devData, error: devError } = await supabase.from('repositories').select(`
                *,
                organization:organizations (*),
                featured_image:featured_images (*)
            `)
            .order('name')
            .eq('name', 'Sourcery U')
            .single()
            if ( devData ) {
                data.push(devData)
            }
        }

        if ( error ) {
            fetchRepositoriesError.value = error
            return
        }

        repositories.value = data
    }

    return {
        repositories,
        fetchRepositories
    }
}