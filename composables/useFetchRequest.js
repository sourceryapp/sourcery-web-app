export function useFetchRequest(req = null) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const route = useRoute()
    const { getAttachmentPreview } = useFileList()
    const { userRepos } = useAuthUser()

    const request = ref(req)
    const requestId = ref(route.params.id ?? null)

    // This function defaults to the request ID parameter in the route, but can be called with a different ID.
    async function fetchRequest() {
        const { data, error } = await supabase.from('requests').select(`
            *,
            repository:repositories (
                *,
                organization:organizations (*)
            ),
            user!requests_user_id_fkey (*),
            servicer:user!requests_servicer_id_fkey (*),
            request_events (
                *,
                user (*)
            ),
            attachments (*),
            reports (*)
        `).order('created_at', { ascending: false })
            .eq('id', requestId.value)
            .single()

        if ( !error ) {

            /**
             * Attachments are protected, so we need to retrieve signed URLs for them.
             */
            const attachment_paths = data.attachments.map(attachment => attachment.path)
            if ( attachment_paths.length > 0 ) {
                const { data: signedUrlData, error: signedUrlError } = await supabase
                    .storage
                    .from('attachments')
                    .createSignedUrls(attachment_paths, 86400) // Signed for one day.
                signedUrlData.forEach((signedUrl, index) => {
                    if ( !signedUrl.error ) {
                        data.attachments[index].url = signedUrl.signedUrl
                    }
                    data.attachments[index].thumbnail = getAttachmentPreview(data.attachments[index])
                })
            }

            request.value = data
        }
    }

    const isSubmitted = computed(() => {
        return request.value?.status === 'STATUS_CREATED'
    })

    const isCancelled = computed(() => {
        return request.value?.status === 'STATUS_CANCELLED'
    })

    const isInProgress = computed(() => {
        return ['STATUS_UNPAID'].includes(request.value?.status)
    })

    const isCompleted = computed(() => {
        return request.value?.status === 'STATUS_COMPLETE'
    })

    const isPaid = computed(() => {
        return request.value?.status === 'STATUS_PAID'
    })

    const isArchived = computed(() => {
        return request.value?.status === 'STATUS_ARCHIVED'
    })

    const isUnassigned = computed(() => {
        return isInProgress.value && !request.value?.servicer_id && request.value.public_can_claim
    })

    const isPublic = computed(() => {
        return !!request.value?.public_can_claim
    })

    const isClaimed = computed(() => {
        return !!request.value?.servicer_id
    })

    const isOwner = computed(() => {
        return request.value?.user_id === user.value?.id
    })

    const isServicer = computed(() => {
        return request.value?.servicer_id === user.value?.id
    })

    const submittedDate = computed(() => {
        return request.value.request_events.find(event => event.status === 'STATUS_CREATED')?.created_at ?? null
    })

    const confirmedDate = computed(() => {
        return request.value.request_events.find(event => ['STATUS_UNPAID', 'STATUS_PAID'].includes(event.status))?.created_at ?? null 
    })

    const completedDate = computed(() => {
        return request.value.request_events.find(event => event.status === 'STATUS_COMPLETE')?.created_at ?? null 
    })

    const archivedDate = computed(() => {
        return request.value.request_events.find(event => event.status === 'STATUS_ARCHIVED')?.created_at ?? null 
    })

    const cancelledDate = computed(() => { 
        return request.value.request_events.find(event => event.status === 'STATUS_CANCELLED')?.created_at ?? null 
    })

    const requestLabel = computed(() => {
        return request.value.vendor_label ?? request.value.client_label ?? request.value.original_title ?? 'Untitled'
    })

    const hasRepositoryAccess = computed(() => {
        return userRepos?.value.some(repo => repo.id === request.value?.repository?.id)
    })

    const canService = computed(() => {
        // If a user has access to the repository that the request is assigned to, they can service it.
        let valid = userRepos?.value.some(repo => repo.id === request.value?.repository?.id)

        // If the user does not have that access, they can still service the request if it is claimed and the repository is null.
        if ( isClaimed.value && request.value?.servicer_id && request.value?.servicer_id === user.value?.id && request.value.repository_id === null ) {
            valid = true
        }
        return valid
    })

    const canViewAttachments = computed(() => {
        return isServicer.value || (
            isOwner.value && isPaid.value
        )
    })

    const isReported = computed(() => {
        return request.value?.reports.length > 0
    })


    return {
        request,
        requestId,
        requestLabel,
        fetchRequest,
        isSubmitted,
        isInProgress,
        isCompleted,
        isPaid,
        isArchived,
        isCancelled,
        isUnassigned,
        isPublic,
        isClaimed,
        isServicer,
        isOwner,
        hasRepositoryAccess,
        isReported,
        confirmedDate,
        completedDate,
        archivedDate,
        cancelledDate,
        canService,
        canViewAttachments
    }
}