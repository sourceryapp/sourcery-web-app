<template>
    <div id="page-join-us" class="py-10">
        <v-container>
            <v-row>
                <v-col cols="12" md="8" offset-md="2" v-if="!submitSuccess">
                    <h1 class="mb-2">Join Us</h1>
                    <p class="mb-8">Fill out the form below if you are interested in joining Sourcery as a request-fulfilling institution.</p>

                    <v-form ref="joinUsForm" v-model="joinUsFormValid" @submit.prevent="submitForm" validate-on="submit">
                        <h2 class="mb-4">Institution information</h2>

                        <p><strong>What is the name of your institution?</strong></p>
                        <v-text-field v-model="formFields.name" variant="outlined" placeholder="Institution Name" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount1000]"></v-text-field>

                        <p><strong>What is the name of the repository?</strong></p>
                        <v-text-field v-model="formFields.repository" variant="outlined" placeholder="Repository Name" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount1000]"></v-text-field>

                        <p><strong>What email address should be used for the Sourcery account?</strong></p>
                        <p class="text-subtitle-2">This address will be used to field requests and for email notifications. We recommend using a non-personal institutional email address that anyone fulfilling requests can access, such as "requestservice@institution.org"</p>
                        <v-text-field v-model="formFields.account_email" variant="outlined" type="email" placeholder="Account Email Address" :rules="[$sourceryForms.rules.email]"></v-text-field>

                        <p><strong>What is the website URL associated with this repository?</strong></p>
                        <v-text-field v-model="formFields.website" variant="outlined" placeholder="Link or URL" :rules="[$sourceryForms.rules.characterCount1000]"></v-text-field>

                        <p><strong>What is the institution's mailing address?</strong></p>
                        <v-text-field v-model="formFields.address" variant="outlined" placeholder="Mailing Address" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount1000]"></v-text-field>


                        <h2 class="my-4">Contact Information</h2>
                        <p><strong>Please provide your contact information.</strong></p>
                        <v-text-field v-model="formFields.contact_name" label="Name" variant="outlined" placeholder="Contact Name" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount1000]"></v-text-field>
                        <v-text-field v-model="formFields.contact_email" label="Email" variant="outlined" type="email" placeholder="Contact Email" :rules="[$sourceryForms.rules.email, $sourceryForms.rules.characterCount1000]"></v-text-field>

                        <p><strong>Would you like to provide any additional details or comments?</strong></p>
                        <v-textarea v-model="formFields.additional_details" variant="outlined" placeholder="Additional Details" :rules="[$sourceryForms.rules.largeTextAreaCounter]"></v-textarea>

                        <v-btn type="submit" color="primary" :disabled="submitSuccess || formSending">Submit</v-btn>
                    </v-form>
                </v-col>

                <v-col v-else>
                    <h1 class="mb-2">You're all set!</h1>
                    <p class="mb-8">Keep an eye out for an email at your institutional email inbox over the next few days for a link to finalize your account.</p>
                    <v-btn to="/" color="primary" x-large class="my-6">Return to home page</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'public'
})

const supabase = useSupabaseClient()

const joinUsForm = ref()
const joinUsFormValid = ref(false)
const formSending = ref(false)

const formFields = ref({
    name: '',
    repository: '',
    account_email: '',
    website: '',
    address: '',
    photo_option: false,
    contact_name: '',
    contact_email: '',
    additional_details: ''
})

const submitSuccess = ref(false)

async function submitForm() {
    formSending.value = true
    const { valid, errors } = await joinUsForm.value.validate()
    if ( valid ) {
        const { data, error } = await supabase.from('institution_ingestion').insert([formFields.value])

        if ( error ) {
            console.error(error)
        } else {
            submitSuccess.value = true
        }
    }
    formSending.value = false
}
</script>