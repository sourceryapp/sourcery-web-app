export function useManageUriRequest(req = null) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const route = useRoute()

    const request = ref(req)
    const uriId = ref(req?.id ?? route.params.id ?? null)
    const repository = ref(null)

    async function fetchUriRequest() {
        const { data, error } = await supabase.from('requests').select(`
            *,
            user (*)
        `).eq('id', uriId.value).single()

        if ( error ) {
            console.error(error)
        } else {
            request.value = data
        }
    }

    async function convert() {
        console.log({ request: request.value, repository: repository.value })
        if ( request.value && repository.value ) {
            const { data, error } = await supabase.from('requests').update({
                repository_id: repository.value.id,
                status_id: 1
            }).eq('id', request.value.id).select().single()

            if ( error ) {
                console.error(error)
            } else {
                request.value = data

                // Notify organization they have a request.
                await supabase.functions.invoke('notify', {
                    body: {
                        user_id: request.value.user_id,
                        request_id: request.value.id,
                        action: 'request_submitted_to_your_org'
                    }
                })

                navigateTo('/request/' + request.value.id)
                return true
            }
        }
        return false
    }

    async function deleteRequest() {
        if ( request.value ) {
            const { data, error } = await supabase.from('requests')
                .update({ deleted: true })
                .eq('id', request.value.id)
                .select()

            if ( error ) {
                console.error(error)
            } else {
                request.value.deleted = true
                return true
            }
        }
        return false
    }

    return {
        uriId,
        request,
        repository,
        fetchUriRequest,
        convert,
        deleteRequest
    }

}