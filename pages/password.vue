<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-alert
        :value="error"
        class="my-3"
        type="error"
      >
        <span color="white">{{ error.message }}</span>
      </v-alert>
      <v-alert
        :value="success"
        class="my-3"
        type="success"
      >
        <span color="white">An email has been sent to the provided address.</span>
      </v-alert>

      <h3>Reset Password</h3>

      <p>Enter your email address and click submit. An email instructing you of how to change your password will be sent shortly.</p><p /><form @submit.prevent="resetPassEmail">
        <v-layout>
          <v-flex>
            <v-text-field
              id="email"
              v-model="email"
              label="Enter Email"
              name="email"
            />
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center>
          <v-btn @click="$router.go(-1)">
            Back
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
          >
            Submit
          </v-btn>
        </v-layout>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
    name: 'Password',
    auth: false,
    data () {
        return {
            email: '',
            success: false,
            error: false
        }
    },
    computed: {
        user () {
            return this.$store.getters['auth/activeUser']
        }
    },
    methods: {
        resetPassEmail () {
            this.success = false
            this.error = false
            this.$fire.auth.sendPasswordResetEmail(this.email).then(() => {
                this.success = true
                this.email = ''
            }).catch((error) => {
                this.error = error
            })
        },
        returnAndLog () {
            this.$fire.auth.signOut().then(() => {
                console.log('logout complete')
                this.$router.replace('/login')
            }).catch((error) => {
                console.log(error)
            })
        }
    }

}
</script>

<style scoped>

</style>
