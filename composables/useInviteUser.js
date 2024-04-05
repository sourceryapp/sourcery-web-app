export function useInviteUser() {
    const supabase = useSupabaseClient()

    const email = ref('')
    const loading = ref(false)
    const confirmedUser = ref(null)

    async function inviteUser() {
        loading.value = true
        console.log(email.value)

        const { data, error } = await supabase.functions.invoke('get_or_create_user', {
            body: {
                email: email.value
            }
        })

        if ( error ) {
            console.error(error)
            loading.value = false
            return
        }

        confirmedUser.value = data.data ? data.data : null

        loading.value = false

        return data
    }

    return {
        email,
        loading,
        confirmedUser,
        inviteUser
    }

}