<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <h1>Reset Pass</h1>
      <form @submit.prevent="resetPass">
        <v-layout>
          <v-flex>
            <v-text-field
              id="password"
              v-model="password"
              label="Enter Password"
              name="password"
            />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-text-field
              id="confirmpassword"
              v-model="confirmpassword"
              label="Confirm Password"
              name="confirmpassword"
            />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-btn
              :disabled="!passwordIsValid"
              type="submit"
            >
              Submit
            </v-btn>
          </v-flex>
        </v-layout>
      </form>
      <v-btn :to="{name: 'login'}">
        Return
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
    name: 'Resetpass',
    auth: false,
    data () {
        return {
            password: '',
            confirmpassword: '',
            mismatch_password: false
        }
    },
    computed: {
        passwordIsValid () {
            if (this.password !== this.confirmpassword || this.password === '') {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        getUrlVars () {
            const vars = {}
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = value
            })
            return vars.test
        },
        resetPass () {
            const code = this.getUrlVars()
            this.$fire.auth.confirmPasswordReset(code, this.password)
                .then(function () {
                    console.log('success')
                })
                .catch(function (error) {
                    if (error) {
                        console.log('Error', error)
                    }
                })
        }
    }
}
</script>

<style scoped>
</style>
