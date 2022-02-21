<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <v-form @submit.prevent="handleMagicEmailLogin">
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

      <v-form @submit.prevent="handleEmailPassLogin">
        <h1>Log In With Supabase Password</h1>
        <v-text-field
          v-model="passEmail"
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
        <v-text-field
          v-model="passPass"
          name="password"
          label="Password"
          required
          :type="showPass ? 'text' : 'password'"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[$sourceryForms.rules.required]"
          prepend-icon="mdi-security"
          validate-on-blur
          outlined
          @click:append="showPass = !showPass"
        />
        <!-- <span v-for="(err, index) in errors.password" :key="index" class="text-red">{{ err }}</span> -->
        <span v-if="messagePass" class="text-red">{{ messagePass }}</span>
        <v-btn
          block
          depressed
          x-large
          type="submit"
          color="primary"
          :loading="loadingPass"
          :disabled="loadingPass"
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
            messagePass: '',
            passPass: '',
            passEmail: '',
            showPass: false,
            loading: false,
            loadingPass: false
        }
    },
    methods: {
        async handleMagicEmailLogin () {
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
        },
        async handleEmailPassLogin () {
            this.loadingPass = true
            try {
                const { user, error } = await supabase.auth.signIn({
                    email: this.passEmail,
                    password: this.passPass
                })
                if (error) {
                    throw error
                }
                this.$toast.success('Logged in Successfully!')
                this.$router.push('/dashboard')
                console.log(user)
            } catch (e) {
                console.log(e)
                this.messagePass = e.message
            } finally {
                this.loadingPass = false
            }
        }
    }
}
</script>
