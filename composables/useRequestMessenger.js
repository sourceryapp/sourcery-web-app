export function useRequestMessenger(req = null) {
    const supabase = useSupabaseClient()
    const { canService } = useFetchRequest(req)

    const request = ref(req)
    const messages = ref([])

    function sendMessage() {
        console.log('Sending message...')
    }

    async function getMessages() {
        const { data, error } = await supabase.from('request_comments')
            .select('*')
            .eq('request_id', request.value.id)
            .order('created_at', { ascending: false })

        if ( !error ) {
            messages.value = data
        }
    }

    async function clearUnread() {
        if ( canService.value ) {
            request.value.request_vendors.has_unread = false
            await supabase.from('request_vendors')
                .update({ has_unread: false })
                .eq('request_id', request.value.id)
        } else {
            request.value.request_clients.has_unread = false
            await supabase.from('request_clients')
                .update({ has_unread: false })
                .eq('request_id', request.value.id)
        }
    }

    const hasUnread = computed(() => {
        console.log(request.value)
        if ( canService.value ) {
            return request.value.request_vendors.has_unread ?? false
        }
        return request.value.request_clients.has_unread ?? false
    })

    return {
        request,
        messages,
        getMessages,
        sendMessage,
        hasUnread,
        clearUnread
    }

}