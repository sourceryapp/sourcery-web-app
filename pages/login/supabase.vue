<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <v-form @submit.prevent="handleLogin">
        <h1>Log In With Supabase</h1>
        <v-text-field
          v-model="email"
          type="email"
          name="email"
          label="Email"
          :rules="[$sourceryForms.rules.required, $sourceryForms.rules.email]"
          required
          validate-on-blur
          prepend-icon="mdi-email"
          autofocus
          outlined
        />
        <span v-if="message" class="text-red">{{ message }}</span>
        <v-btn
          block
          depressed
          x-large
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="loading"
          style="font-weight: 800"
          class="mb-1"
        >
          Log In
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { supabase } from '~/plugins/supabase'

export default {
    data () {
        return {
            email: '',
            message: '',
            loading: false
        }
    },
    methods: {
        async handleLogin () {
            this.loading = true
            try {
                const redirection = process.env.BASE_URL === 'http://localhost:3000' ? 'http://localhost:3002/supabase' : process.env.BASE_URL + '/supabase'
                console.log('redirect to:', redirection)
                const { error } = await supabase.auth.signIn({ email: this.email }, {
                    redirectTo: redirection
                })
                if (error) {
                    throw error
                }
                this.$toast.success('Check your email for a login link!')
            } catch (e) {
                this.message = e.error_description || e.message
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
