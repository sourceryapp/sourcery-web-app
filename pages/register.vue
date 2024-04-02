<template>
    <div id="page-register">
        <v-container>
            <v-row>
                <v-col md="6" offset-md="3">
                    <h1 class="text-center mb-3">Register</h1>

                    <v-form @submit.prevent="register" v-model="formValid" validate-on="submit">
                        <v-text-field v-model="formValues.name" type="text" name="name" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount100]" label="Full Name" required clearable prepend-icon="mdi-account-circle" variant="outlined" autocomplete="off" class="mb-3"></v-text-field>

                        <v-text-field v-model="formValues.email" type="email" label="Email" prepend-icon="mdi-email" required variant="outlined" class="mb-3" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.email]"></v-text-field>

                        <v-text-field v-model="formValues.password" type="password" label="Password" prepend-icon="mdi-lock" required variant="outlined" class="mb-3" :rules="[$sourceryForms.rules.required, ...$sourceryForms.rules.password]"></v-text-field>

                        <input-tel ref="telInput" class="mb-3"></input-tel>

                        <v-alert type="error" variant="tonal" v-if="formError" class="mb-3">{{ formError }}</v-alert>

                        <v-btn block color="primary" type="submit" size="x-large" :disabled="formLoading" class="mb-3">Register</v-btn>

                        <p class="text-center">Already have an account? <nuxt-link to="/login">Log in here.</nuxt-link></p>
                    </v-form>
                </v-col>
            </v-row>
            
        </v-container>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { fetchUserMetadata } = useAuthUser()
const route = useRoute()
const formValid = ref()
const formValues = ref({
    name: '',
    email: '',
    password: '',
    phone: ''
})
const formLoading = ref(false)
const formError = ref('')
const telInput = ref()
async function register(submitEvent) {
    formLoading.value = true
    formError.value = ''

    formValues.value.phone = telInput.value.getValue()

    // Require a form submission event
    if ( !submitEvent ) {
        return
    }

    // Resolve validation
    await submitEvent

    if ( !formValid.value ) {
        formLoading.value = false
        return
    }

    const { data: { user }, error } = await supabase.auth.signUp({
        email: formValues.value.email,
        password: formValues.value.password,
        options: {
            data: {
                phone: formValues.value.phone,
                name: formValues.value.name
            }
        }
    })

    if ( error ) {
        formError.value = error.message
        formLoading.value = false
        return
    }

    // Notify
    const { data: notifyData, error: notifyError } = await supabase.functions.invoke('notify', {
        body: {
            user_id: user.id,
            action: 'signed_up'
        }
    })

    if ( notifyError ) {
        console.error('Error notifying', notifyError)
    }

    await fetchUserMetadata()

    if ( route.query.redirectTo ) {
        navigateTo(route.query.redirectTo)
    } else {
        navigateTo('/dashboard')
    }

    formLoading.value = false
}


function validate() {

}
</script>