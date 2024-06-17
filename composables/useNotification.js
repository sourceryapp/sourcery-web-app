export function useNotification(notif) {
    const supabase = useSupabaseClient()

    const notification = ref(notif)

    const icon = computed(() => {
        switch (notification.value.type) {
            case 'new_message':
                return 'mdi-email-plus'
            case 'new_request':
                return 'mdi-invoice-plus'
            case 'request_picked_up':
                return 'mdi-truck-check'
            case 'request_completed':
                return 'mdi-truck-check'
            case 'request_cancelled':
                return 'mdi-truck-alert'
            default:
                return 'mdi-information'
        }
    })

    const title = computed(() => {
        const notif_request_title = notification.value.data?.request?.original_title ? notification.value.data.request.original_title : 'Untitled'
        switch (notification.value.type) {
            case 'new_message':
                return 'New Message Received'
            case 'new_request':
                return 'New Request Submitted - ' + notif_request_title
            case 'request_picked_up':
                return 'Request Picked Up - ' + notif_request_title
            case 'request_completed':
                return 'Request Completed - ' + notif_request_title
            case 'request_cancelled':
                return 'Request Cancelled - ' + notif_request_title
            default:
                return 'New Notification'
        }

    })

    async function clickAction() {
        await markAsRead()
        switch (notification.value.type) {
            case 'new_message':
                navigateTo(`/request/${notification.value.data.request.id}#messages`)
                break
            case 'new_request':
                navigateTo(`/request/${notification.value.data.request.id}`)
                break
            case 'request_picked_up':
                navigateTo(`/request/${notification.value.data.request.id}`)
                break
            case 'request_completed':
                navigateTo(`/request/${notification.value.data.request.id}`)
                break
            default:
                break
        }
    }

    async function markAsRead() {
        const { data, error } = await supabase.from('notifications')
            .update({ read: true })
            .eq('id', notification.value.id)
            .single()

        if ( error ) {
            console.error(error)
            return
        }

        notification.value.read = true
        return
    }

    return {
        notification,
        icon,
        title,
        clickAction,
        markAsRead
    }

}