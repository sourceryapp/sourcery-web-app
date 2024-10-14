export function useCompleteRequest(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const dialogActive = ref(false)
    const completeLoading = ref(false)

    async function completeRequest() {
        completeLoading.value = true

        // Update the request status to completed
        const { data, error } = await supabase.from('requests').update({
            status: 'STATUS_COMPLETE'
        }).eq('id', request.value.id).select()

        // Submit an event log for the request completion
        await supabase.rpc('event_status_changed', {
            request_id: request.value.id,
            user_id: user.value.id
        })

        const { data: notifyData, error: notifyError } = await supabase.functions.invoke('notify', {
            body: {
                user_id: user.value.id,
                request_id: request.value.id,
                action: 'request_you_submitted_complete'
            }
        })
        
        request.value.status = 'STATUS_COMPLETE'
        dialogActive.value = false
        
        completeLoading.value = false
    }

    return {
        dialogActive,
        completeRequest,
        completeLoading
    }

}