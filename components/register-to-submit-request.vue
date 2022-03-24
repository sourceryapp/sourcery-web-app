<template>
  <v-dialog v-model="open" max-width="600">
    <v-form
      ref="register_new_email_form"
      v-model="form_valid"
      lazy-validation
      @submit.prevent="register()"
    >
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <p>{{ bodyText }}</p>
          <v-text-field
            v-if="allowRegister || loggingIn"
            v-model="newUserEmailAddress"
            label="Email Address"
            :rules="[$sourceryForms.rules.required, $sourceryForms.rules.email]"
            required
          />
          <p v-if="allowRegister && !loggingIn">
            Already registered? <NuxtLink to="/login">
              Login Here
            </NuxtLink>
          </p>
          <!-- eslint-disable-next-line -->
          <p v-if="showPrivacyTermsWarning">By submitting your email address to Sourcery you agree to our <NuxtLink to="/terms">Terms &amp; Conditions</NuxtLink>, and have reviewed our <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.</p>
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
          <v-btn
            :color="closeButtonType"
            text
            @click="closeDialog()"
          >
            {{ closeButtonText }}
          </v-btn>
          <v-btn v-if="allowRegister && !hasSubmitted" color="primary" text type="submit">
            Register
          </v-btn>
          <v-btn v-if="!allowRegister && !loggingIn" color="primary" text nuxt to="/login">
            Login
          </v-btn>
          <v-btn v-if="loggingIn && !hasSubmitted && submitResultAlert.type != `error`" color="primary" text type="submit">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { supabase } from '~/plugins/supabase'

export default {
    data () {
        return {
            open: false,
            newUserEmailAddress: '',
            form_valid: true,
            allowRegister: false,
            loggingIn: false,
            submitResultAlert: {
                show: false,
                body: 'There has been an error registering.',
                type: 'warning'
            },
            hasSubmitted: false
        }
    },
    computed: {
        ...mapGetters({
            citation: 'supabaseCreate/citation',
            pages: 'supabaseCreate/pages',
            repository_id: 'supabaseCreate/repositoryId'
        }),
        bodyText () {
            if (this.allowRegister) {
                return 'In order to submit a request, you must be registered with Sourcery.  Please log in, or submit your email address to register with us.'
            } else if (this.loggingIn) {
                return 'Please submit your email address to receive a link to login via email.'
            }
            return 'In order to submit a paid request, you must be registered with Sourcery.  Please log in to proceed.'
        },
        showPrivacyTermsWarning () {
            if (this.allowRegister || this.loggingIn) {
                return true
            }
            return false
        },
        title () {
            if (this.allowRegister) {
                return 'Register to Submit Request'
            } else if (this.loggingIn) {
                return 'Log In with One Time Link'
            }
            return 'Account Required - Paid Request'
        },
        closeButtonText () {
            if (this.hasSubmitted) {
                return 'Close'
            }
            return 'Cancel'
        },
        closeButtonType () {
            if (this.hasSubmitted) {
                return 'primary'
            }
            return ''
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
        openWithLoginIntent (email = '') {
            if (email) {
                this.newUserEmailAddress = email
            }
            this.loggingIn = true
            this.openDialog()
        },
        async register () {
            this.validateRegisterNewEmailForm()
            if (this.form_valid) {
                try {
                    const url = window.location
                    const redirection = `${url.origin}/dashboard`
                    // const redirection = process.env.BASE_URL === 'http://localhost:3000' ? 'http://localhost:3002/dashboard' : process.env.BASE_URL + '/dashboard'
                    console.log('redirect to:', redirection)
                    const { error } = await supabase.auth.signIn({ email: this.newUserEmailAddress }, {
                        redirectTo: redirection
                    })
                    if (error) {
                        throw error
                    }
                    if (this.loggingIn) {
                        this.submitResultAlert.body = 'Please check your email for a link to login.'
                    } else {
                        this.submitResultAlert.body = 'Please check your email for a link to register.'
                    }
                    this.submitResultAlert.type = 'success'
                    this.submitResultAlert.show = true

                    const localStateData = {
                        request: {
                            citation: this.citation,
                            pages: this.pages,
                            repository_id: this.repository_id
                        }
                    }

                    localStorage.setItem('sourceryInProgressRequest', JSON.stringify(localStateData))

                    this.hasSubmitted = true
                } catch (e) {
                    this.submitResultAlert.body = e.error_description || e.message
                    this.submitResultAlert.type = 'error'
                    this.submitResultAlert.show = true
                }
            }
        },
        validateRegisterNewEmailForm () {
            this.$refs.register_new_email_form.validate()
        }
    }
}
</script>
