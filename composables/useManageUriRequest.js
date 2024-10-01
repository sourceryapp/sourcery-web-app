export function useManageUriRequest(req = null) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { authUser, userRepos } = useAuthUser()
    const route = useRoute()

    const request = ref(req)
    const uriId = ref(req?.id ?? route.params.id ?? null)
    const repository = ref(null)
    const publicAccess = ref(false)

    const canManage = computed(() => {
        return authUser.value.admin
            || request.value
            && (request.value.user_id === user.value.id
                || userRepos?.value.some(repo => repo.id === request.value?.repository?.id)
        )
    })

    const canClaim = computed(() => {
        return authUser.value.admin
            || (request.value.public_can_claim
                && !request.value.repository_id
                && !request.value.deleted
                && request.value.servicer_id === null
                && request.value.user_id !== user.value.id)
    })

    async function fetchUriRequest() {
        const { data, error } = await supabase.from('requests').select(`
            *,
            user!requests_user_id_fkey (*)
        `).eq('id', uriId.value).single()

        if ( error ) {
            console.error(error)
        } else {
            request.value = data
        }
    }

    async function convert() {
        console.log({ request: request.value, repository: repository.value, publicAccess: publicAccess.value })

        // This request is being marked as public so it will go into public access for sourcery users to claim.
        if ( publicAccess.value ) {
            const { data, error } = await supabase.from('requests').update({
                status_id: 1,
                public_can_claim: true
            }).eq('id', request.value.id).select().single()

            if ( error ) {
                console.error(error)
            } else {
                request.value = data

                // Notify all sourcery users that a new request is available.
                // await supabase.functions.invoke('notify', {
                //     body: {
                //         user_id: user.value.id,
                //         request_id: request.value.id,
                //         action: 'request_submitted_to_public'
                //     }
                // })

                navigateTo('/request/' + request.value.id)
                return true
            }
        }
        
        // This request is being converted to one owned by a repository.
        else if ( request.value && repository.value ) {
            const { data, error } = await supabase.from('requests').update({
                repository_id: repository.value.id,
                status_id: 1
            }).eq('id', request.value.id).select().single()

            if ( error ) {
                console.error(error)
            } else {
                request.value = data

                // Notify organization they have a request.
                await supabase.functions.invoke('notify', {
                    body: {
                        user_id: request.value.user_id,
                        request_id: request.value.id,
                        action: 'request_submitted_to_your_org'
                    }
                })

                navigateTo('/request/' + request.value.id)
                return true
            }
        }

        // Something has gone wrong.
        return false
    }


    async function claimRequest() {
        if ( request.value ) {
            const { data, error } = await supabase.rpc('claim_request', {
                input_request_id: request.value.id,
                input_user_id: user.value.id
            })

            if ( error ) {
                console.error(error)
            } else {
                await fetchUriRequest()
                return true
            }
        }
        return false
    }

    async function deleteRequest() {
        if ( request.value ) {
            const { data, error } = await supabase.from('requests')
                .update({ deleted: true })
                .eq('id', request.value.id)
                .select()

            if ( error ) {
                console.error(error)
            } else {
                request.value.deleted = true
                return true
            }
        }
        return false
    }

    return {
        uriId,
        request,
        repository,
        publicAccess,
        canManage,
        canClaim,
        fetchUriRequest,
        convert,
        claimRequest,
        deleteRequest
    }

}