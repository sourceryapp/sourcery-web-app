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
          <p>
            In order to submit a request, you must be registered with Sourcery.
            Please log in, or submit your email address to quickly register with
            us.
          </p>
          <v-text-field
            v-model="newUserEmailAddress"
            label="Email Address"
            :rules="emailRules"
            required
          />
          <p>
            Already registered? <NuxtLink to="/login">
              Login Here
            </NuxtLink>
          </p>
          <!-- eslint-disable-next-line -->
          <p>By submitting your email address to Sourcery you agree to our <NuxtLink to="/terms">Terms &amp; Conditions</NuxtLink>, and have reviewed our <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.</p>
          <!-- skipped -->
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="open = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="register()">
            Register
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
            ]
        }
    },
    methods: {
        openDialog () {
            this.open = true
        },
        closeDialog () {
            this.open = false
        },
        register () {
            this.validateRegisterNewEmailForm()
            if (this.form_valid) {
                console.log('valid register data')
            } else {
                console.log('not valid register data')
            }
        },
        validateRegisterNewEmailForm () {
            this.$refs.register_new_email_form.validate()
        }
    }
}
</script>
