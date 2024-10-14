export function useClaimRequest(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const dialogActive = ref(false)
    const claimLoading = ref(false)

    async function claimRequest() {
        claimLoading.value = true

        // Update the request status to claimed
        const { data, error } = await supabase.from('requests').update({
            status: 'STATUS_PAID'
        }).eq('id', request.value.id).select()

        // Submit an event log for the request claim
        await supabase.rpc('event_status_changed', {
            request_id: request.value.id,
            user_id: user.value.id
        })

        const { data: notifyData, error: notifyError } = await supabase.functions.invoke('notify', {
            body: {
                user_id: user.value.id,
                request_id: request.value.id,
                action: 'request_you_submitted_picked_up'
            }
        })
        
        request.value.status = 'STATUS_PAID'
        dialogActive.value = false
        
        claimLoading.value = false
    }

    return {
        dialogActive,
        claimRequest,
        claimLoading
    }

}