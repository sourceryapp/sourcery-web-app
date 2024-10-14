export function useArchiveRequest(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const dialogActive = ref(false)
    const archiveLoading = ref(false)

    async function archiveRequest() {
        archiveLoading.value = true

        // Update the request status to archived
        const { data, error } = await supabase.from('requests').update({
            status: 'STATUS_ARCHIVED'
        }).eq('id', request.value.id).select()

        // Submit an event log for the request archive
        await supabase.rpc('event_status_changed', {
            request_id: request.value.id,
            user_id: user.value.id
        })
        
        request.value.status = 'STATUS_ARCHIVED'
        dialogActive.value = false
        
        archiveLoading.value = false
    }

    return {
        dialogActive,
        archiveRequest,
        archiveLoading
    }
}