<template>
  <v-dialog
    v-model="open"
    max-width="600"
  >
    <v-form
      ref="finish_email_link_registration_form"
      v-model="formValid"
      lazy-validation
    >
      <v-card>
        <v-card-title>Finish Registration</v-card-title>
        <v-card-text>
          <p>{{ bodyText }}</p>
          <v-text-field
            v-model="registrationEmail"
            label="Email Address"
            :rules="emailRules"
            required
          />
          <v-alert
            v-if="alert.show"
            :type="alert.type"
          >
            {{ alert.body }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!hasSubmittedSuccessfully"
            color="primary"
            text
            :disabled="!formValid"
            @click="finishRegistration()"
          >
            Finish Registration
          </v-btn>
          <v-btn
            v-if="hasSubmittedSuccessfully"
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
            formValid: true,
            registrationEmail: '',
            emailRules: [
                v => !!v || 'Email is required.',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
            ],
            bodyText: 'Please re-enter the email you are registering.  For security reasons, we might not have been able to identify this automatically.',
            alert: {
                show: false,
                type: 'warning',
                body: 'There has been some error registering.'
            },
            hasSubmittedSuccessfully: false
        }
    },
    created () {
        const saved_info = JSON.parse(localStorage.getItem('sourceryEmailSignInWith'))
        if (saved_info && saved_info.email) {
            this.registrationEmail = saved_info.email
        }
    },
    methods: {
        openDialog () {
            this.open = true
        },
        closeDialog () {
            this.open = false
        },
        finishRegistration () {
            this.validateForm()
            if (this.formValid) {
                this.$fire.auth.signInWithEmailLink(this.registrationEmail, window.location.href)
                    .then((result) => {
                        localStorage.removeItem('sourceryEmailSignInWith')
                        this.alert.type = 'success'
                        this.alert.body = 'Successful registration!'
                        this.alert.show = true
                        this.hasSubmittedSuccessfully = true
                        this.$emit('finishRegistration')
                    })
                    .catch((error) => {
                        this.alert.type = 'error'
                        this.alert.body = `${error.code}: ${error.message}`
                        this.alert.show = true
                    })
            }
        },
        validateForm () {
            this.$refs.finish_email_link_registration_form.validate()
        }
    }
}
</script>
