export default function useCreateRequest() {
    const supabase = useSupabaseClient()
    const { authUser } = useAuthUser()
    const route = useRoute()

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
        referrer: null,
        referrer_data: null
    })
    const createdRequest = ref()

    populateFromSession()  // For Future Developers - this is the 'draft mode' feature used for unregistered users
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
        requestFormError.value = null

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
                    original_title: requestFields.value.title,
                    referrer: requestFields.value.referrer,
                    referrer_data: requestFields.value.referrer_data
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

                const { data, error } = await supabase.from('requests').insert({
                    user_id: requestFields.value.user.id,
                    original_title: requestFields.value.title,
                    citation: requestFields.value.details,
                    repository_name: requestFields.value.customRepository,
                    repository_location: requestFields.value.customRepositoryLocation,
                    referrer: requestFields.value.referrer,
                    referrer_data: requestFields.value.referrer_data,
                    status_id: 6
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



                    navigateTo(`/dashboard`)
                }
            }
        }
        return null
    }

    /**
     * Draft Mode
     */
    function populateFromSession() {
        const requestFromSession = JSON.parse(localStorage.getItem('sourceryInProgressRequest'))
        if ( requestFromSession ) {
            requestFields.value.title = requestFromSession.title,
            requestFields.value.details = requestFromSession.details,
            requestFields.value.repository = requestFromSession.repository
            requestFields.value.referrer = requestFromSession.referrer
            requestFields.value.referrer_data = requestFromSession.referrer_data
            requestFields.value.customRepository = requestFromSession.customRepository
            requestFields.value.customRepositoryLocation = requestFromSession.customRepositoryLocation
            clearSessionDraft()
            return true
        }
        return false
    }

    function setSessionDraft() {
        localStorage.setItem('sourceryInProgressRequest', JSON.stringify({
            title: requestFields.value.title,
            details: requestFields.value.details,
            repository: requestFields.value.repository,
            referrer: requestFields.value.referrer,
            referrer_data: requestFields.value.referrer_data,
            customRepository: requestFields.value.customRepository,
            customRepositoryLocation: requestFields.value.customRepositoryLocation
        }))
    }

    function clearSessionDraft() {
        localStorage.removeItem('sourceryInProgressRequest')
    }


    /**
     * Populating from query
     * Integrations depend on this:
     * - ArchivesSpace
     * - Translation Server
     */
    function populateFromQuery() {
        if ( route.query ) {
            if ( route.query.title ) {
                requestFields.value.title = route.query.title
            }

            if ( route.query.source ) {
                requestFields.value.referrer = route.query.source
            }

            if ( route.query.message ) {
                try{
                    const json_message = JSON.parse(route.query.message)
                    // Message is of type JSON
                    // Let's parse it correctly
                    if ( typeof json_message === "object") {
                        console.log('parsing json source')
                        processQueryMessage(json_message)
                    } else {
                        requestFields.value.details = route.query.message
                    }
                } catch (e) {
                    // Not a JSON message so let's just fill the message with the query contents.
                    requestFields.value.details = route.query.message
                }
            }


            if ( route.query.repo_id ) {
                const matchingRepo = repositories.value.find(repo => String(repo.id) === route.query.repo_id)
                if ( matchingRepo ) {
                    requestFields.value.repository = matchingRepo
                    repository.value = matchingRepo
                }
            }
        }
    }

    function processQueryMessage(message) {
        requestFields.value.referrer_data = message
        console.log(message)
        let details = ''
        if ( message.title ) {
            details += `Title: ${message.title}\n`
        }

        if ( message.publicationTitle ) {
            details += `Publication Title: ${message.publicationTitle}\n`
        }

        if ( message.libraryCatalog ) {
            details += `Library Catalog: ${message.libraryCatalog}\n`
        }

        if ( message.url ) {
            details += `URL: ${message.url}\n`
        }

        if ( message.date ) {
            details += `Date: ${message.date}\n`
        }

        if ( Array.isArray(message.creators) && message.creators.length > 0 ) {
            details += `Creators: ${message.creators[0].firstName} ${message.creators[0].lastName}\n`
        }

        requestFields.value.details = details
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
        clearSessionDraft,
        populateFromQuery
    }

}