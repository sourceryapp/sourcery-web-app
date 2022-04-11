<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3>
      <register-to-submit-request
        ref="login_with_link_dialog"
      />
      <v-alert type="warning" dismissible>
        NOTICE: If your last log in was before April 12, 2022, you might need to use the One-Time Link login, then reset your password.
      </v-alert>
      <v-form @submit.prevent="handleEmailPassLogin">
        <h1 class="text-center mb-2">
          Log In
        </h1>
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
        <v-btn
          block
          depressed
          x-large
          color="primary"
          style="font-weight: 800"
          class="mb-1"
          @click="loginWithOneTimeLink()"
        >
          Log In With One-Time Link
        </v-btn>
        <v-btn
          block
          text
          large
          to="/password"
        >
          Forgot password?
        </v-btn>

        <v-divider class="my-3" />

        <h2 class="text-center mb-2">
          Don't have an account?
        </h2>
        <v-btn
          block
          outlined
          x-large
          color="primary"
          to="/register"
          style="border-color: #dad4ea; font-weight: 800"
        >
          Register
        </v-btn>

        <p class="mt-2">
          Interested in working with Sourcery as an institution? <nuxt-link to="/join-us">
            Let us know.
          </nuxt-link>
        </p>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { supabase } from '~/plugins/supabase'
import RegisterToSubmitRequest from '~/components/register-to-submit-request.vue'

export default {
    components: { RegisterToSubmitRequest },
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
        async handleEmailPassLogin () {
            this.loadingPass = true
            try {
                const { error } = await supabase.auth.signIn({
                    email: this.passEmail,
                    password: this.passPass
                })
                if (error) {
                    throw error
                }
                this.$toast.success('Logged in Successfully!')
            } catch (e) {
                console.log(e)
                this.messagePass = e.message
            } finally {
                this.loadingPass = false
            }
        },
        loginWithOneTimeLink () {
            this.$refs.login_with_link_dialog.openWithLoginIntent(this.email)
        }
    }
}
</script>
