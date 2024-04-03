<template>
    <div id="page-request-create" class="pb-5">
        <v-container>
            <v-row justify="center">
                <v-col sm="10" md="8">
                    <h1 class="mb-4">Create a Request</h1>

                    <v-form v-model="requestFormValid" validate-on="submit" @submit.prevent="createRequest">
                        <h2 class="mb-4">Select Repository</h2>

                        <v-img max-height="200" rounded="lg" :src="bannerImage" class="mb-4"></v-img>

                        <repository-select v-model="repository" @custom-selected="setCustomRepository"></repository-select>

                        <v-alert color="primary" icon="$info" v-if="repository" class="mb-4">You have selected the {{ repository.name }} at {{ repository.organization.name }}.</v-alert>

                        <v-alert type="warning" variant="tonal" icon="$info" v-if="requestFields.customRepository" class="mb-4">
                            <strong class="text-h6 font-weight-bold">{{ requestFields.customRepository }}</strong>
                            <p class="mb-1">You have selected an institution that is not yet registered with Sourcery.</p>
                            <v-btn @click="requestFields.customRepository = ''">Remove</v-btn>
                        </v-alert>

                        <div v-if="requestFields.customRepository">
                            <h3 class="mb-3">Let's make sure we have enough information to locate this repository.</h3>
                            <p>Please provide any relevant contact or location information that would help the Sourcery team track down this repository.</p>
                            <v-textarea v-model="requestFields.customRepositoryLocation" label="Location and Contact Details" variant="outlined" class="mb-4" hide-details rows="3"></v-textarea>
                        </div>


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

                        <v-alert color="error" icon="$error" :text="requestFormError" class="mb-4" v-if="requestFormError"></v-alert>

                        <v-card v-if="requestFields.customRepository" title="Requesting from Unregistered Institution" class="mb-5">
                            <v-card-text>
                                <p>If the institution you're looking for is not already a registered user of Sourcery, our team will reach out to the institution to let them know that they have a request waiting. If they choose to fulfill the request through Sourcery, they will create an account and you will see your request status go to “in-progress”. Once the repository has fulfilled the request, you will receive your documents through the app.</p>
                                <p>If an institution prefers not to fulfill the request through Sourcery, your request will not be fulfilled and will remain as “pending” on your dashboard. There is also a chance the repository will contact you directly via email.</p>
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
const { repository, bannerImage } = useSelectRepository()
const { authUser, isOrgOwner } = useAuthUser()
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
} = useCreateRequest()

// I would set this up as a normal ref, but I don't feel like keeping track of other .value calls in composables
watch(repository, () => {
    requestFields.value.repository = repository.value
    if ( repository.value ) {
        requestFields.value.customRepository = ''
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