<template>
  <v-layout row fill-height align-center>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <v-form @submit.prevent="login">
        <h1 class="text-xs-center">
          Log In
        </h1>
        <v-alert
          :value="loginError"
          type="error"
          transition="slide-y-transition"
          outline
        >
          Username or password is incorrect.
        </v-alert>
        <v-text-field
          v-model="email"
          type="email"
          name="email"
          label="Email"
          :rules="emailRules"
          required
          clearable
          validate-on-blur
          prepend-icon="email"
          autofocus
          box
        />
        <span v-for="(err, index) in errors.email" :key="index" class="text-red">{{ err }}</span>
        <v-text-field
          v-model="password"
          name="password"
          label="Password"
          required
          :type="showPass ? 'text' : 'password'"
          :append-icon="showPass ? 'visibility' : 'visibility_off'"
          :rules="[v => !!v || 'Password is required']"
          prepend-icon="security"
          validate-on-blur
          box
          @click:append="showPass = !showPass"
        />
        <span v-for="(err, index) in errors.password" :key="index" class="text-red">{{ err }}</span>

        <v-btn
          block
          depressed
          large
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="loading"
        >
          Log In
        </v-btn>
        <v-btn block flat large to="/password">
          Forgot password?
        </v-btn>

        <v-divider class="mt-3 mb-3" />

        <h2 class="text-xs-center">
          Don't Have an Account?
        </h2>
        <v-btn block outline large color="primary" to="/register">
          Register
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Login',
    layout: 'default',
    data () {
        return {
            valid: true,
            email: '',
            emailRules: [
                v => !!v || 'Email is required',
                v => /.+@.+/.test(v) || 'Email must be valid'
            ],
            password: '',
            showPass: false,
            loginError: false,
            loading: false,
            errors: {
                password: [],
                email: []
            },
            errorMessage: ''
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser'
        })
    },
    watch: {
        // Not a fan of this (@bdaley): https://github.com/nuxt-community/firebase-module/issues/148#issuecomment-611474296
        user (val) {
            console.log('Watched User val', val)
            if (val) {
                this.$router.push({ name: 'dashboard' })
            }
        }
    },
    methods: {

        async login () {
            this.loading = true
            this.loginError = false

            // @url https://firebase.google.com/docs/auth/web/start#sign_in_existing_users
            console.log('logging in')
            try {
                await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
                console.log('Logged in!')
            } catch (error) {
                console.log('Error code:', error.code, 'Error message', error.message)
                this.loginError = true
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
h1 {
    margin-bottom: 12px;
  }
</style>
