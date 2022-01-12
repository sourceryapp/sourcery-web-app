<template>
  <v-list-item>
    <v-list-item-avatar
      :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
    >
      <v-icon
        :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
      >
        mdi-lock
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>Password</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-dialog
        v-model="open"
        scrollable
        persistent
        :overlay="false"
        max-width="360px"
        transition="dialog-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :color="passwordActionButtonType"
            text
            v-bind="attrs"
            v-on="on"
          >
            {{ changePasswordShortLabel }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
          >
            {{ changePasswordLabel }}
          </v-card-title>
          <v-divider />
          <v-form @submit.prevent="resetPass">
            <v-card-text>
              <v-alert
                :value="passSuccess"
                type="success"
              >
                <span color="white">Password successfully changed.</span>
              </v-alert>
              <v-alert
                :value="passFail"
                type="error"
                text
              >
                <span color="white">Old Password is incorrect.</span>
              </v-alert>
              <v-alert
                :value="passError"
                type="error"
              >
                <span color="white">An Error Has Occurred. Please Try Again Later.</span>
              </v-alert>
              <v-text-field
                v-if="user.hasPassword"
                id="oldpassword"
                v-model="oldpassword"
                type="password"
                label="Old Password"
                name="oldpassword"
                :rules="[$sourceryForms.rules.required]"
                outlined
              />
              <v-text-field
                id="newpassword"
                v-model="newpassword"
                name="password"
                label="New Password"
                messages="At least 8 characters and 1 special character."
                :rules="$sourceryForms.rules.password"
                :type="showPass ? 'text' : 'password'"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                required
                counter
                error-count="2"
                validate-on-blur
                outlined
                @click:append="showPass = !showPass"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="close()"
              >
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                :disabled="!passwordIsValid"
                text
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            open: false,
            oldpassword: '',
            newpassword: '',
            showPass: false,
            passError: false,
            passFail: false,
            passSuccess: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser'
        }),
        changePasswordLabel () {
            if (!this.user.hasPassword) {
                return 'Set Password'
            }
            return 'Change Password'
        },
        changePasswordShortLabel () {
            if (!this.user.hasPassword) {
                return 'Set'
            }
            return 'Change'
        },
        passwordActionButtonType () {
            if (!this.user.hasPassword) {
                return 'warning'
            }
            return 'primary'
        },
        // rewriting this to not require confirm field
        // https://uxmovement.com/forms/why-the-confirm-password-field-must-die/
        passwordIsValid () {
            return this.newpassword.length >= 8 && this.$sourceryForms.special_characters.some(substring => this.newpassword.includes(substring))
        }
    },
    methods: {
        resetPass () {
            this.passError = false
            this.passFail = false
            this.passSuccess = false
            if (!this.user.hasPassword) {
                this.updatePass()
            } else {
                this.$fire.auth.currentUser.reauthenticateWithCredential(
                    this.$fireModule.auth.EmailAuthProvider.credential(
                        this.$fire.auth.currentUser.email,
                        this.oldpassword
                    )
                ).then((success) => {
                    this.updatePass()
                }).catch((error) => {
                    console.log('error', error)
                    this.passFail = true
                })
            }
        },
        updatePass () {
            const user = this.$fire.auth.currentUser
            const newPassword = this.newpassword

            user.updatePassword(newPassword).then((success) => {
                this.$toast.success('New password successfully saved.')
                this.newpassword = ''
                this.oldpassword = ''
                this.$store.commit('auth/SET_AUTH_USER_HAS_PASSWORD')
                // Close the dialog if already had a password, since the modal will now represent a different action (Change Password) from Set Password.
                this.close()
            }).catch((error) => {
                console.log('unknown error', error)
                this.passError = true
            })
        },
        close () {
            this.oldpassword = ''
            this.newpassword = ''
            this.open = false
        }
    }
}
</script>
