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
        repository: {}
    })
    const createdRequest = ref()

    populateFromSession()
    requestFormPopulateCurrentUser(authUser.value)

    function requestFormPopulateCurrentUser() {
        setClient(authUser.value)
    }

    function setClient(user) {
        requestFields.value.user.name = '',
        requestFields.value.user.email = user?.email ?? '',
        requestFields.value.user.id = user?.id ?? null
    }

    async function createRequest(formSubmitEvent) {
        requestFormLoading.value = true

        // This is a weird one, vuetify3 form events are async and the validation is not done until the promise resolves.
        // So, we have to await the event for requestFormValid.value to be true.
        // Can also access the formSubmitEvent.valid property from this awaited prop.
        if ( formSubmitEvent ) await formSubmitEvent

        if ( requestFormValid.value ) {
            requestCreatedSubmitDialog.value = true
            const { data, error } = await supabase.from('requests').insert({
                repository_id: requestFields.value.repository.id,
                citation: requestFields.value.details,
                status_id: 1,
                user_id: requestFields.value.user.id,
                original_title: requestFields.value.title
            }).select().single()

            if ( error ) {
                requestFormError.value = error
            } else {
                localStorage.removeItem('sourceryInProgressRequest')
                createdRequest.value = data
            }
        }

        requestFormLoading.value = false
        console.log(createdRequest.value)
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

    return {
        requestFields,
        requestFormValid,
        requestFormLoading,
        requestFormError,
        createdRequest,
        requestCreatedSubmitDialog,
        clientIsUser,
        setClient,
        requestFormPopulateCurrentUser,
        createRequest,
        setSessionDraft,
        clearSessionDraft
    }

}