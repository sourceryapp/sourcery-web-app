export function useNotification(notif) {
    const supabase = useSupabaseClient()

    const notification = ref(notif)

    const icon = computed(() => {
        switch (notification.value.type) {
            case 'new_message':
                return 'mdi-email-plus'
            case 'new_request':
                return 'mdi-invoice-plus'
            default:
                return 'mdi-information'
        }
    })

    const title = computed(() => {
        switch (notification.value.type) {
            case 'new_message':
                return 'New Message Received'
            case 'new_request':
                return 'New Request Submitted - ' + notification.value.data.request.original_title
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