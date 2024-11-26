<template>
    <div id="page-request-create" class="pb-5">
        <v-container>
            <v-row justify="center">
                <v-col sm="10" md="8">
                    <h1 class="mb-4">Create a Request</h1>

                    <template v-if="isOrgOwner">
                        <v-radio-group v-model="requestType">
                            <v-radio v-for="(repo, ind) in userRepos" :label="`Submit directly to ${repo.name}`" :value="ind" class="mb-2"></v-radio>
                            <v-radio value="normal" label="Submit a General Sourcery Request" class="mb-2"></v-radio>
                        </v-radio-group>
                    </template>

                    <v-form v-model="requestFormValid" validate-on="submit" @submit.prevent="createRequest">
                        <h2 class="mb-4">Repository Location</h2>

                        <template v-if="requestType === 'normal'">
                            <p>Location must be in US or Canada.</p>
                            <v-text-field v-model="requestFields.customRepository" variant="outlined" class="mb-2" label="Repository Name" :rules="[$sourceryForms.rules.required || requestType !== 'normal']"></v-text-field>

                            <div>
                                <h3 class="mb-3">Let's make sure we have enough information to locate this repository.</h3>
                                <p>Please provide any relevant contact or location information that would help the Sourcery team track down this repository.</p>
                                <v-textarea v-model="requestFields.customRepositoryLocation" label="Location and Contact Details" variant="outlined" class="mb-4" rows="3" :rules="[$sourceryForms.rules.required || requestType !== 'normal']"></v-textarea>
                            </div>
                        </template>

                        <template v-else>
                            <v-alert color="primary" icon="$info" v-if="requestFields.repository" class="mb-4">You are requesting directly to {{ requestFields.repository.name }} at {{ requestFields.repository.organization.name }}.</v-alert>
                        </template>
                        

                        <h2 class="mb-4 mt-10">Document Information</h2>

                        <div class="mb-4" v-if="isOrgOwner">
                            <user-invite @invite-user="invitedUser" v-if="clientIsUser"></user-invite>
                            <v-btn v-else color="warning" @click="requestFormPopulateCurrentUser">Reset User</v-btn>
                        </div>
                        
                        <v-text-field v-model="requestFields.user.name" variant="outlined" class="mb-2" :label="clientIsUser ? 'Your Name' : 'Client Name'" :rules="[$sourceryForms.rules.required]" counter="100"></v-text-field>
                        <v-text-field v-model="requestFields.user.email" variant="outlined" class="mb-2" disabled readonly :label="clientIsUser ? 'Your Email' : 'Client Email'" :rules="[$sourceryForms.rules.email]"></v-text-field>
                        <v-text-field v-model="requestFields.title" variant="outlined" class="mb-2" label="Request Title" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount100]" counter="100"></v-text-field>

                        <p>Help the folks on the other end locate your document(s) by providing as much relevant information as you have (e.g. page numbers, box or folder numbers, collections, links, citations).</p>
                        <v-textarea v-model="requestFields.details" variant="outlined" class="mb-2" label="Request Details" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.largeTextAreaCounter]" counter="6000"></v-textarea>


                        <div class="mb-4">
                            <p>Estimate the expected size and expected cost of the request:</p>
                            <p><em>The final total will be confirmed by the fulfilling user, unless claimed by an organization.</em></p>
                            <v-row>
                                <v-col>
                                    <span class="d-block mb-2">{{ pagesNumber }} pages</span>
                                    <!-- Placeholder Pricing -->
                                    <span class="text-h3 mb-2">{{ $utils.currencyFormat(((requestFields.pages * 0.4) + 10) * 100) }}</span>
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
</script>

<style scoped lang="scss">
.icon-very-large {
    font-size: 80px;
}
</style>