/**
 * Composable is responsible for updating a user profile/metadata in supabase.
 * This will also live update the current authUser object in the application.
 */
export default function useUpdateProfile() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const { authUser, fetchUserMetadata } = useAuthUser()

    const updateProfile = async (profile) => {
        const allowedKeys = ['name', 'phone']
        for (const key in profile) {
            if (!allowedKeys.includes(key)) {
                delete profile[key]
            }
        }

        const { data, error } = await supabase.from('user').update(profile)
            .eq('id', user.value.id)
            .select()

        if (error) {
            throw error
        }

        fetchUserMetadata()
    }

    return { updateProfile }
}