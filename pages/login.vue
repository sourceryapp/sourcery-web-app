<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <register-to-submit-request
        ref="login_with_link_dialog"
      />
      <v-form @submit.prevent="login">
        <h1 class="text-center">
          Log In
        </h1>
        <v-alert
          :value="loginError"
          type="error"
          transition="slide-y-transition"
          text
        >
          Username or password is incorrect.
        </v-alert>
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
        <span v-for="(err, index) in errors.email" :key="index" class="text-red">{{ err }}</span>
        <v-text-field
          v-model="password"
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
        <span v-for="(err, index) in errors.password" :key="index" class="text-red">{{ err }}</span>
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
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import registerToSubmitRequest from '@/components/register-to-submit-request.vue'

export default {
    name: 'Login',
    components: { registerToSubmitRequest },
    layout: 'default',
    data () {
        return {
            valid: true,
            email: '',
            password: '',
            showPass: false,
            loginError: false,
            loading: false,
            errors: {
                password: [],
                email: []
            },
            errorMessage: '',
            archiveSpace: this.$store.state.archive.archiveOrigin
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser'
        })
    },
    methods: {

        async login () {
            this.loading = true
            this.loginError = false
            try {
                await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
                console.log('Logged in!')
            } catch (error) {
                console.log('Error code:', error.code, 'Error message', error.message)
                this.loginError = true
                this.loading = false
            }
        },

        loginWithOneTimeLink () {
            this.$refs.login_with_link_dialog.openWithLoginIntent(this.email)
        }
    }
}
</script>

<style scoped>
h1 {
    margin-bottom: 12px;
  }
</style>
