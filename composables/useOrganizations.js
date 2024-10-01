export default function useOrganizations() {
    const supabase = useSupabaseClient()
    const email = ref('')

    const organizations = ref([])
    async function getOrganizations() {
        const { data, error } = await supabase.from('organizations').select(`*`)
            .order('name')
            .range(0, 100)

        if ( !error ) {
            organizations.value = data
        }
    }


    const organization = ref()
    async function getOrganization(id) {
        const { data, error } = await supabase.from('organizations').select('*, repositories (*), owner:owner_id(*)')
            .eq('id', id)
            .single()

        if ( !error ) {
            organization.value = data
        }
    }


    const organizationUsers = ref([])
    async function getOrganizationUsers(organizationId) {
        const { data, error } = await supabase.from('organization_users').select('*, user:user_id(*)')
            .eq('organization_id', organizationId)

        if ( !error ) {
            organizationUsers.value = data
        }
    }


    async function inviteUser(organizationId) {
        const { data, error } = await supabase.functions.invoke('organization', {
            body: {
                action: 'invite_user',
                email: email.value,
                organization_id: organizationId
            }
        })

        if ( error ) {
            throw error
        }
        return data
    }


    async function removeUser(organizationId, userId) {
        const { data, error } = await supabase.from('organization_users').delete().eq('organization_id', organizationId).eq('user_id', userId)

        if ( error ) {
            throw error
        }

        return data
    }

    return {
        email,
        organizations,
        organization,
        organizationUsers,
        getOrganizations,
        getOrganization,
        getOrganizationUsers,
        inviteUser,
        removeUser
    }
}