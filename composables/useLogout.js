/**
 * Allows an easy way to logout of the application.
 */
export const useLogout = () => {
    const supabase = useSupabaseClient()

    function logout() {
        navigateTo('/logout')
    }

    return { logout }
}