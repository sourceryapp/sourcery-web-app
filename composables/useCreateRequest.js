export default function useCreateRequest() {
    const supabase = useSupabaseClient()
    const { authUser } = useAuthUser()

    const requestFormValid = ref(false)
    const requestFormLoading = ref(false)
    const requestFormError = ref()
    const requestCreatedSubmitDialog = ref(false)
    const requestFields = ref({
        user: {
            name: '',
            email: '',
            id: null
        },
        title: '',
        details: '',
        repository: {},
        customRepository: '',
        customRepositoryLocation: '',
    })
    const createdRequest = ref()

    populateFromSession()
    requestFormPopulateCurrentUser(authUser.value)

    function requestFormPopulateCurrentUser() {
        setClient(authUser.value)
    }

    function setClient(user) {
        requestFields.value.user.name = user?.name ?? '',
        requestFields.value.user.email = user?.email ?? '',
        requestFields.value.user.id = user?.id ?? null
    }

    function setCustomRepository(name) {
        requestFields.value.customRepository = name
    }

    async function createRequest(formSubmitEvent) {
        requestFormLoading.value = true

        // This is a weird one, vuetify3 form events are async and the validation is not done until the promise resolves.
        // So, we have to await the event for requestFormValid.value to be true.
        // Can also access the formSubmitEvent.valid property from this awaited prop.
        if ( formSubmitEvent ) await formSubmitEvent

        if ( !hasValidRepository.value ) {
            requestFormError.value = 'Please select a repository or provide a custom repository name and location.'
            requestFormLoading.value = false
            return null
        }

        if ( requestFormValid.value ) {
            requestCreatedSubmitDialog.value = true

            if ( !requestFields.value.customRepository ) {
                const { data, error } = await supabase.from('requests').insert({
                    repository_id: requestFields.value.repository.id,
                    citation: requestFields.value.details,
                    status_id: 1,
                    user_id: requestFields.value.user.id,
                    original_title: requestFields.value.title
                }).select().single()

                requestFormLoading.value = false

                if ( error ) {
                    requestFormError.value = error
                } else {
                    localStorage.removeItem('sourceryInProgressRequest')
                    createdRequest.value = data

                    // Notifies team of NPI request.
                    await supabase.functions.invoke('notify', {
                        body: {
                            user_id: createdRequest.value.user_id,
                            request_id: createdRequest.value.id,
                            action: 'request_submitted_to_your_org'
                        }
                    })


                    navigateTo(`/request/${data.id}`)
                }
            } else {

                const { data, error } = await supabase.from('requests_prospective').insert({
                    user_id: requestFields.value.user.id,
                    title: requestFields.value.title,
                    description: requestFields.value.details,
                    repository_name: requestFields.value.customRepository,
                    repository_location: requestFields.value.customRepositoryLocation
                }).select().single()

                requestFormLoading.value = false

                if ( error ) {
                    requestFormError.value = error
                } else {
                    localStorage.removeItem('sourceryInProgressRequest')
                    createdRequest.value = data

                    // Optional / Can Fails after this comment.
                    // Populates spreadsheet with NPI request.
                    await supabase.functions.invoke('prospective', {
                        body: createdRequest.value
                    })

                    // Notifies team of NPI request.
                    await supabase.functions.invoke('notify', {
                        body: {
                            user_id: createdRequest.value.user_id,
                            rp_id: createdRequest.value.id,
                            action: 'npi_request_to_requester'
                        }
                    })



                    navigateTo(`/requests/unregistered`)
                }
            }
        }
        return null
    }

    function populateFromSession() {
        const requestFromSession = JSON.parse(localStorage.getItem('sourceryInProgressRequest'))
        if ( requestFromSession ) {
            requestFields.value.title = requestFromSession.title,
            requestFields.value.details = requestFromSession.details,
            requestFields.value.repository = requestFromSession.repository
            clearSessionDraft()
            return true
        }
        return false
    }

    function setSessionDraft() {
        localStorage.setItem('sourceryInProgressRequest', JSON.stringify({
            title: requestFields.value.title,
            details: requestFields.value.details,
            repository: requestFields.value.repository
        }))
    }

    function clearSessionDraft() {
        localStorage.removeItem('sourceryInProgressRequest')
    }

    const clientIsUser = computed(() => {
        if ( authUser.value ) {
            return requestFields.value.user.id === authUser.value.id
        }
        return true
    })

    const hasValidRepository = computed(() => {
        return requestFields.value.repository?.id || !!(requestFields.value.customRepository && requestFields.value.customRepositoryLocation)
    })

    return {
        requestFields,
        requestFormValid,
        requestFormLoading,
        requestFormError,
        createdRequest,
        requestCreatedSubmitDialog,
        clientIsUser,
        setClient,
        setCustomRepository,
        requestFormPopulateCurrentUser,
        createRequest,
        setSessionDraft,
        clearSessionDraft
    }

}