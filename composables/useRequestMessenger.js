export function useRequestMessenger(req = null) {
    const supabase = useSupabaseClient()

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

    return {
        request,
        messages,
        getMessages,
        sendMessage
    }

}