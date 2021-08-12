<template>
  <v-dialog v-model="open" max-width="600">
    <v-form
      ref="register_new_email_form"
      v-model="form_valid"
      lazy-validation
    >
      <v-card>
        <v-card-title>Register to Submit Request</v-card-title>
        <v-card-text>
          <p>{{ bodyText }}</p>
          <v-text-field
            v-if="allowRegister"
            v-model="newUserEmailAddress"
            label="Email Address"
            :rules="emailRules"
            required
          />
          <p v-if="allowRegister">
            Already registered? <NuxtLink to="/login">
              Login Here
            </NuxtLink>
          </p>
          <!-- eslint-disable-next-line -->
          <p v-if="allowRegister">By submitting your email address to Sourcery you agree to our <NuxtLink to="/terms">Terms &amp; Conditions</NuxtLink>, and have reviewed our <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.</p>
          <!-- skipped -->

          <v-alert
            v-if="submitResultAlert.show"
            :type="submitResultAlert.type"
          >
            {{ submitResultAlert.body }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="!hasSubmitted" text @click="closeDialog()">
            Cancel
          </v-btn>
          <v-btn v-if="allowRegister && !hasSubmitted" color="primary" text @click="register()">
            Register
          </v-btn>
          <v-btn v-if="!allowRegister" color="primary" text nuxt to="/login">
            Login
          </v-btn>
          <v-btn
            v-if="hasSubmitted"
            color="primary"
            text
            @click="closeDialog()"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
    data () {
        return {
            open: false,
            newUserEmailAddress: '',
            form_valid: true,
            emailRules: [
                v => !!v || 'Email is required.',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
            ],
            allowRegister: false,
            submitResultAlert: {
                show: false,
                body: 'There has been an error registering.',
                type: 'warning'
            },
            hasSubmitted: false
        }
    },
    computed: {
        bodyText () {
            if (this.allowRegister) {
                return 'In order to submit a request, you must be registered with Sourcery.  Please log in, or submit your email address to register with us.'
            }
            return 'In order to submit a paid request, you must be registered with Sourcery.  Please log in to proceed.'
        }
    },
    methods: {
        openDialog () {
            this.open = true
        },
        closeDialog () {
            this.open = false
        },
        openWithRegisterIntent () {
            this.allowRegister = true
            this.openDialog()
        },
        register () {
            this.validateRegisterNewEmailForm()
            if (this.form_valid) {
                // Valid
                const emailSignUpConfig = {
                    // URL to return to.  Must be an authorized domain in Firebase Authentication.
                    url: 'http://bs-local.com:3000/request/create',
                    handleCodeInApp: true
                }

                this.$fire.auth.sendSignInLinkToEmail(this.newUserEmailAddress, emailSignUpConfig)
                    .then(() => {
                        this.submitResultAlert.body = 'Please check your email for a link to register.'
                        this.submitResultAlert.type = 'success'
                        this.submitResultAlert.show = true
                        localStorage.setItem('sourceryEmailSignInWith', JSON.stringify({
                            email: this.newUserEmailAddress,
                            request: {
                                citation: this.$store.state.create.citation,
                                pages: this.$store.state.create.pages,
                                repository_id: this.$store.state.create.repository_id
                            }
                        }))
                        this.hasSubmitted = true
                    })
                    .catch((error) => {
                        this.submitResultAlert.body = `${error.code}: ${error.message}`
                        this.submitResultAlert.type = 'error'
                        this.submitResultAlert.show = true
                    })
            }
        },
        validateRegisterNewEmailForm () {
            this.$refs.register_new_email_form.validate()
        }
    }
}
</script>
