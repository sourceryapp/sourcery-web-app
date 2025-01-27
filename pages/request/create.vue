<template>
    <div id="page-request-create" class="pb-5">
        <div class="bg-primary py-4 position-relative mb-4">
            <h1 class="text-center">Create a Request</h1>
            <div class="triangle-bottom-center"></div>
        </div>
        <v-container>
            <v-row justify="center">
                <v-col sm="10" md="8">

                    <v-row justify="center" class="mb-4">
                        <v-col cols="12" md="10">
                            <v-autocomplete
                                v-model="sel"
                                label="Where are your documents?"
                                class="text-center"
                                :rules="[$sourceryForms.rules.required]"
                                :items="places"
                                density="comfortable"
                                prepend-inner-icon="mdi-magnify"
                                variant="solo"
                                item-title="text.text"
                                item-value="text.placeId"
                                v-on:update:search="retrievePlaces"
                                v-on:update:model-value="onAutocompleteChange"
                                :return-object="true"
                            ></v-autocomplete>
                            <v-alert v-if="sel" class="mb-5">
                                <p><strong>{{ sel.text.text }}</strong></p>
                                <!-- <p>{{ placeSelected.location.latitude }}, {{ placeSelected.location.longitude }}</p> -->
                                <p>Does this look right?</p>
                                <v-btn color="error" @click="placeSelected.value = null;sel = null; ">Clear</v-btn>
                            </v-alert>

                            <div>
                                <iframe v-if="googleMapsEmbedUrl" width="500" height="400" :src="googleMapsEmbedUrl" frameborder="0" loading="lazy" class="w-100" style="pointer-events: none"></iframe>
                            </div>
                        </v-col>
                    </v-row>

                    <v-form v-model="requestFormValid" validate-on="submit" @submit.prevent="createRequest">
                        

                        <h2 class="mb-4 mt-10">Document Information</h2>
                        
                        <v-text-field v-model="requestFields.user.name" variant="outlined" class="mb-2" :label="clientIsUser ? 'Your Name' : 'Client Name'" :rules="[$sourceryForms.rules.required]" counter="100"></v-text-field>
                        <v-text-field v-model="requestFields.user.email" variant="outlined" class="mb-2" disabled readonly :label="clientIsUser ? 'Your Email' : 'Client Email'" :rules="[$sourceryForms.rules.email]"></v-text-field>
                        <v-text-field v-model="requestFields.title" variant="outlined" class="mb-2" label="Request Title" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount100]" counter="100"></v-text-field>

                        <p>Help the folks on the other end locate your document(s) by providing as much relevant information as you have (e.g. page numbers, box or folder numbers, collections, links, citations).</p>
                        <v-textarea v-model="requestFields.details" variant="outlined" class="mb-2" label="Request Details" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.largeTextAreaCounter]" counter="6000"></v-textarea>


                        <div class="mb-4">
                            <p>Estimate the expected size and expected cost of the request:</p>
                            <p><em>The final total will be confirmed by the fulfilling user, unless claimed by an organization.</em></p>
                            <v-row align="end" class="mb-1 mt-2 px-4">
                                <v-col>
                                    <span class="d-block">{{ pagesNumber }} page(s)</span>
                                    <!-- Placeholder Pricing -->
                                </v-col>
                                <v-col>
                                    <span class="text-h4">{{ $utils.currencyFormat(((requestFields.pages * 0.4) + 10) * 100) }}</span>
                                </v-col>
                            </v-row>
                            <v-slider min="1" max="100" color="primary" hide-details step="1" v-model="requestFields.pages"></v-slider>
                        </div>

                        <v-alert color="error" icon="$error" :text="requestFormError" class="mb-4" v-if="requestFormError"></v-alert>

                        <v-card v-if="requestFields.customRepository" title="A Note on Requests" class="mb-5">
                            <v-card-text>
                                <p>If the institution you're looking for is not already a registered user of Sourcery, our team will reach out to the institution to let them know that they have a request waiting. If they choose to fulfill the request through Sourcery, they will create an account and you will see your request status go to "In Progress". Once the repository has fulfilled the request, you will receive your documents through the app.</p>
                                <p>If an institution prefers to not fulfill the request through Sourcery, your request will not be fulfilled and will remain as "pending" on your dashboard. There is also a chance the repository will contact you directly via email.</p>
                            </v-card-text>
                        </v-card>

                        <div class="d-flex justify-space-between my-3 mb-8" v-if="authUser">
                            <v-btn to="/dashboard" color="surface">Back</v-btn>
                            <v-btn type="submit" color="primary" >Submit</v-btn>
                        </div>
                        <div v-else>
                            <v-alert type="warning" variant="outlined" class="mb-5">You will need to register before submitting this request. The request will be saved as a draft on this device as you complete your login/registration.</v-alert>
                            <div class="d-flex">
                                <v-btn @click="unregisteredNavigate('/register')" color="primary" class="mr-3">Register</v-btn>
                                <v-btn @click="unregisteredNavigate('/login')" color="surface">Login</v-btn>
                            </div>
                        </div>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog v-model="requestCreatedSubmitDialog" width="600">
            <v-card title="Submitting Request">
                <v-card-text v-if="requestFormError">
                    <v-alert color="error" icon="$error" :text="requestFormError"></v-alert>
                </v-card-text>
                <v-card-text class="text-center my-5" v-if="requestFormLoading">
                    <v-progress-circular indeterminate color="primary" size="60" width="7"></v-progress-circular>
                </v-card-text>
                <v-card-text v-if="createdRequest" class="text-center">
                    <v-icon icon="mdi-check-circle-outline" color="primary" class="icon-very-large my-3"></v-icon>
                    <p>Congratulations, you have successfully created a request!</p>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
const { repository } = useSelectRepository()
const { authUser, isOrgOwner, userRepos } = useAuthUser()
const { $sourceryForms } = useNuxtApp()
const {
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
    populateFromQuery
} = useCreateRequest()
const config = useRuntimeConfig();

const requestType = ref('normal');

const pagesNumber = computed(() => {
    let p = requestFields.value.pages
    if ( requestFields.value.pages >= 100 ) {
        p = '100+'
    }
    return p
})

populateFromQuery()

// I would set this up as a normal ref, but I don't feel like keeping track of other .value calls in composables
watch(requestType, () => {
    // requestFields.value.repository = repository.value
    if ( requestType.value !== 'normal' ) {
        // console.log(requestType.value, userRepos.value[requestType.value])
        requestFields.value.repository = userRepos.value[requestType.value]
        requestFields.value.customRepository = ''
        requestFields.value.customRepositoryLocation = ''
    } else {
        setCustomRepository(null)
    }
})

function invitedUser(user) {
    setClient(user)
}

function unregisteredNavigate(to) {
    setSessionDraft()
    navigateTo({
        path: to,
        query: {
            redirectTo: '/request/create'
        }
    })
}

const sel = ref(null)
const places = ref([])
const placeSelected = ref(null)
function debounce(func, wait) {
    let timeout
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

const googleMapsEmbedUrl = computed(() => {
    if ( !sel.value) {
        return ''
    }

    return `https://www.google.com/maps/embed/v1/place?key=${config.public.GOOGLE_PLACES_API_KEY}&q=place_id:${sel.value.placeId}`
})

const retrievePlaces = debounce((value) => {
    if (!value) {
        places.value = []
        return
    }

    fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': config.public.GOOGLE_PLACES_API_KEY
        },
        body: JSON.stringify({
            input: value,
            includedPrimaryTypes: [
                'library',
                'primary_school',
                'school',
                'secondary_school',
                'university'
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        places.value = data.suggestions.map(prediction => prediction.placePrediction)
    })
    .catch(error => {
        console.error('Error fetching places:', error)
    })
}, 300)

function onAutocompleteChange(value) {
    retrievePlace(value.placeId)
}

function retrievePlace(placeId) {
    fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=addressComponents,location&key=${config.public.GOOGLE_PLACES_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            placeSelected.value = data
        })
        .catch(error => {
            console.error('Error fetching place:', error)
        })

}
</script>

<style scoped lang="scss">
.icon-very-large {
    font-size: 80px;
}

.triangle-bottom-center {
    position: absolute;
    bottom: -18px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid rgba(var(--v-theme-primary));
}
</style>