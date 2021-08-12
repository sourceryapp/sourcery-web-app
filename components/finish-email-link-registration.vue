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
            v-model="name"
            label="Display Name"
            :rules="nameRules"
            required
          />
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
            name: '',
            emailRules: [
                v => !!v || 'Email is required.',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
            ],
            nameRules: [
                v => !!v || 'Display Name is required.',
                v => (v && v.length < 100) || 'Display Name is too long.'
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

                        result.user.updateProfile({
                            displayName: this.name,
                            photoURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC'
                        })
                            .then(() => {
                                this.$emit('finishRegistration')
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch((error) => {
                        const messages = {
                            'auth/expired-action-code': 'The email link has expired.',
                            'auth/invalid-email': 'The email address provided was not valid for this registration.',
                            'auth/user-disabled': 'This account email has been disabled.'
                        }
                        this.alert.type = 'error'
                        this.alert.body = messages[error.code]
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
