export function useFetchNotifications() {

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const notifications = ref([])
    const loading = ref(false)

    async function fetchNotifications() {
        loading.value = true
        const { data, error } = await supabase.from('notifications')
            .select(`*`)
            .eq('user_id', user.value.id)
            .eq('read', false)
            .order('created_at', { ascending: false })
            .range(0, 30)

        if ( error ) {
            console.error(error)
            return
        }

        notifications.value.push(...data)

        const { data: readNotificationData, error: readNotificationError } = await supabase.from('notifications')
            .select(`*`)
            .eq('user_id', user.value.id)
            .eq('read', true)
            .order('created_at', { ascending: false })
            .range(0, 30)

        if ( readNotificationError ) {
            console.error(readNotificationError)
            return
        }
        notifications.value.push(...readNotificationData)
        loading.value = false
    }

    const readNotifications = computed(() => {
        return notifications.value.filter(n => n.read)
    })

    const unreadNotifications = computed(() => {
        return notifications.value.filter(n => !n.read)
    })

    return { notifications, unreadNotifications, readNotifications, loading, fetchNotifications }

}