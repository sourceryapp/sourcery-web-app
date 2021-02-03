<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <h1>Profile</h1>

      <v-tabs
        slider-color="primary"
      >
        <v-tab ripple>
          User
        </v-tab>
        <v-tab-item class="pt-2">
          <v-card flat>
            <!-- <v-card-title primary-title>
                            <h3 class="headline ma-0 pa-0">User </h3>
                        </v-card-title> -->
            <v-form ref="detailsForm" @submit.prevent="updateDetails">
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="displayName"
                    v-model="name"
                    type="text"
                    label="Your Name"
                    name="displayName"
                    :rules="[rules.required]"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-btn
                    type="submit"
                    color="primary"
                  >
                    Save
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
          <v-alert
            :value="passSuccess"
            type="success"
          >
            <span color="white">Password successfully changed.</span>
          </v-alert>
          <v-alert
            :value="passFail"
            type="error"
          >
            <span color="white">Old Password Incorrect.</span>
          </v-alert>
          <v-alert
            :value="passError"
            type="error"
          >
            <span color="white">An Error Has Occurred. Please Try Again Later.</span>
          </v-alert>
        </v-tab-item>

        <v-tab ripple>
          Password
        </v-tab>
        <v-tab-item class="pt-2">
          <v-card flat>
            <v-card-title primary-title>
              <h3 class="headline mb-0">
                Change Password
              </h3>
            </v-card-title>
            <form @submit.prevent="resetPass">
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="oldpassword"
                    v-model="oldpassword"
                    type="password"
                    label="Enter Old Password"
                    name="oldpassword"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="newpassword"
                    v-model="newpassword"
                    type="password"
                    label="Enter New Password"
                    name="newpassword"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="confirmpassword"
                    v-model="confirmpassword"
                    type="password"
                    label="Confirm New Password"
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
                <v-flex v-if="!passwordIsValid">
                  <span>New passwords do not match.</span>
                </v-flex>
              </v-layout>
            </form>
            <v-btn @click="forgotLog">
              Forgot Password?
            </v-btn>
          </v-card>
          <v-alert
            :value="passSuccess"
            type="success"
          >
            <span color="white">Password successfully changed.</span>
          </v-alert>
          <v-alert
            :value="passFail"
            type="error"
          >
            <span color="white">Old Password Incorrect.</span>
          </v-alert>
          <v-alert
            :value="passError"
            type="error"
          >
            <span color="white">An Error Has Occurred. Please Try Again Later.</span>
          </v-alert>
        </v-tab-item>
        <v-tab ripple>
          Email
        </v-tab>
        <v-tab-item class="pt-2">
          <v-card flat>
            <v-card-title primary-title>
              <h3 class="headline mb-0">
                Change Email
              </h3>
            </v-card-title>
            <v-form @submit.prevent="changeUserEmail">
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="email"
                    v-model="email"
                    label="Enter New Email"
                    name="email"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="epass"
                    v-model="epass"
                    type="password"
                    label="Enter Password"
                    name="epass"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-btn
                    :disabled="!emailIsValid"
                    type="submit"
                  >
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
          <v-alert
            :value="emailSuccess"
            type="success"
          >
            <span color="white">Email successfully updated.</span>
          </v-alert>
          <v-alert
            :value="emailFail"
            type="error"
          >
            <span color="white">Password Incorrect.</span>
          </v-alert>
          <v-alert
            :value="emailError"
            type="error"
          >
            <span color="white">An Error Has Occurred. Please Try Again Later.</span>
          </v-alert>
        </v-tab-item>
        <v-tab ripple>
          Phone
        </v-tab>
        <v-tab-item class="pt-2">
          <v-card flat>
            <v-form ref="detailsForm" @submit.prevent="setPhone">
              <v-layout>
                <v-flex>
                  <v-text-field
                    id="phoneNumber"
                    v-model="phone"
                    type="text"
                    label="Your Phone Number"
                    name="phoneNumber"
                    :rules="[rules.required]"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-btn
                    type="submit"
                    color="primary"
                  >
                    Save
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
          <v-alert
            :value="phoneSuccess"
            type="success"
          >
            <span color="white">Phone number successfully updated.</span>
          </v-alert>
        </v-tab-item>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
    name: 'Profile',
    data () {
        return {
            name: this.$store.getters['auth/activeUser'].displayName || null,

            email: this.$store.getters['auth/activeUser'].email,
            // phone: this.$store.getters['auth/activeUser'].phoneNumber || null,
            epass: '',
            emailSuccess: false,
            emailFail: false,
            emailError: false,
            phoneSuccess: false,
            phone: this.$store.state.meta.phone,
            confirmPhone: '',

            oldpassword: '',
            newpassword: '',
            confirmpassword: '',
            passSuccess: false,
            passFail: false,
            passError: false,
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length <= 20 || 'Max 20 characters',
                email: (value) => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }
            }
        }
    },
    computed: {
        user () {
            return this.$fire.auth.currentUser
        },
        nameIsValid () {
            return this.name !== ''
        },
        passwordIsValid () {
            // text fields do not match
            if (this.newpassword !== this.confirmpassword || this.newpassword === '') {
                return false
            } else {
                return true
            }
        },
        emailIsValid () {
            return this.email !== '' && this.password !== ''
        },
        giveEmail () {
            return this.user.email
        },
        giveName () {
            console.log('name:', this.user.name)
            return this.user.name
        }
    },
    mounted () {
    // console.log(Auth.currentUser);
    },
    methods: {
        async updateDetails () {
            if (this.$refs.detailsForm.validate()) {
                // console.log(this.phone, this.name);
                const user = this.$fire.auth.currentUser

                /**
                     * Can't set phoneNumber here
                     * @url https://www.reddit.com/r/Firebase/comments/70slpi/can_you_update_phonenumber_from_userprofile/
                     */
                await user.updateProfile({ // @todo Move this to Vuex
                    displayName: this.name
                    // phoneNumber: this.phone,
                })
                this.$store.commit('auth/SET_AUTH_USER', user)
                this.$toast.success('Profile Saved!')
            }
        },
        resetPass () {
            this.$fire.auth.currentUser.reauthenticateWithCredential(
                this.$fireModule.auth.EmailAuthProvider.credential(
                    this.$fire.auth.currentUser.email,
                    this.oldpassword
                )
            ).then((success) => {
                const user = this.$fire.auth.currentUser
                const newPassword = this.newpassword

                user.updatePassword(newPassword).then((success) => {
                    this.passSuccess = true
                }).catch((error) => {
                    console.log('unknown error', error)
                    this.passError = true
                })
            }).catch((error) => {
                console.log('error', error)
                this.passFail = true
            })
        },
        changeUserEmail () {
            this.$fire.auth.currentUser.reauthenticateWithCredential(
                this.$fireModule.auth.EmailAuthProvider.credential(
                    this.$fire.auth.currentUser.email,
                    this.epass
                )
            ).then((success) => {
                const user = this.$fire.auth.currentUser
                user.updateEmail(this.email).then((success) => {
                    this.emailSuccess = true
                }).catch((error) => {
                    console.log('error after reauthenticate', error)
                })
            }).catch((error) => {
                console.log(error)
                this.emailFail = true
            })
        },
        forgotLog () {
            this.$fire.auth.signOut().then(() => {
                console.log('logout complete')
                this.$router.replace('/password')
            }).catch((error) => {
                console.log(error)
            })
        },
        async setPhone () {
            if (this.phone !== null) {
                // Update phone number on the server
                await this.$fire.firestore.collection('user-meta').doc(this.$store.getters['auth/activeUser'].uid).set({
                    phone: this.phone
                }, { merge: true })

                // Update in local store
                this.$store.commit('meta/setPhone', this.phone)
                this.phoneSuccess = true
            }
        }
    }
}
</script>

<style scoped>

</style>
