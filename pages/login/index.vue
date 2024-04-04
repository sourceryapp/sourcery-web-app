<template>
    <div id="page-login" class="py-5">
        <v-container class="mt-10 text-center">
            <v-row justify="center" align="center">
                <v-col md="6">
                    <ToolsLocalLogin />
                    
                    <v-form @submit.prevent="submitLogin" v-model="formValid" validate-on="submit">
                        <h1 class="mb-4">Log In</h1>

                        <p class="mb-6">Provide an email to receive a 6-digit verification code, or use a password to log in.</p>

                        <v-text-field v-model="formEmail" type="email" label="Email" prepend-icon="mdi-email" autofocus variant="outlined" :rules="[$sourceryForms.rules.email]" class="mb-3"></v-text-field>

                        <v-text-field v-model="formPassword" type="password" label="Optional Password" prepend-icon="mdi-lock" variant="outlined" class="mb-3"></v-text-field>

                        <v-alert type="error" variant="tonal" v-if="formError" class="mb-3 text-left">{{ formError }}</v-alert>

                        <v-btn block size="x-large" color="primary" class="font-weight-bold mb-4" type="submit" :loading="formLoading">{{ loginButtonText }}</v-btn>

                        <v-divider class="my-5"></v-divider>

                        <h2 class="text-center mb-2">Don't have an account?</h2>

                        <v-btn block color="primary" to="/register" size="x-large" variant="outlined" class="font-weight-bold">Register</v-btn>
                        <p class="mt-2">Interested in working with Sourcery as an institution? <nuxt-link to="/join-us"> Let us know.</nuxt-link></p>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['guest']
})

const supabase = useSupabaseClient()
const route = useRoute()

const formValid = ref()
const formLoading = ref(false)
const formEmail = ref('')
const formPassword = ref('')
const formError = ref('')

const loginButtonText = computed(() => {
    return formPassword.value ? 'Log In' : 'Get Code'
})

function submitLogin(submitEvent) {
    if ( formPassword.value ) {
        submitPasswordLogin(submitEvent)
    } else {
        submitEmailOtpLogin(submitEvent)
    }
}

async function submitPasswordLogin() {
    formLoading.value = true
    formError.value = ''
    const { data, error } = await supabase.auth.signInWithPassword({
        email: formEmail.value,
        password: formPassword.value
    })

    formLoading.value = false

    if ( error ) {
        formError.value = error.message
        return
    }

    navigateTo({
        path: route.query.redirectTo ?? '/dashboard'
    })
}

async function submitEmailOtpLogin(submitEvent) {
    formLoading.value = true
    formError.value = ''

    if ( !submitEvent ) {
        formLoading.value = false
        return
    }

    await submitEvent

    if ( !formValid.value ) {
        formLoading.value = false
        formError.value = 'Email not valid.'
        return
    }

    const { data, error } = await supabase.auth.signInWithOtp({
        email: formEmail.value,
        options: {
            shouldCreateUser: false,
            emailRedirectTo: `${window.location.protocol}://${window.location.host}/dashboard`
        }
    })

    formLoading.value = false

    if ( error ) {
        formError.value = error.message
        return
    }

    navigateTo({
        path: '/login/otp',
        query: {
            email: formEmail.value,
            redirectTo: route.query.redirectTo ?? undefined
        }
    })
}
</script>