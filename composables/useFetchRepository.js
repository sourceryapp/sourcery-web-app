export default function useFetchRepository() {
    const supabase = useSupabaseClient()

    const repository = ref(null)
    const fetchRepositoryError = ref()

    async function fetchRepository(id) {
        if (!id) {
            fetchRepositoryError.value = 'Repository ID is required'
            return
        }

        const { data, error } = await supabase.from('repositories').select(`
            *,
            organization:organizations (*),
            featured_image:featured_images (*)
        `)
        .eq('id', id)
        .single()

        if (error) {
            fetchRepositoryError.value = error
            return
        }

        repository.value = data

        return data
    }

    return {
        repository,
        fetchRepository
    }
}