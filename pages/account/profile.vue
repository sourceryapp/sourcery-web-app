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
                        <v-form @submit.prevent="updateDetails" ref="detailsForm">
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                        type="text"
                                        label="Your Name"
                                        name="displayName"
                                        id="displayName"
                                        :rules="[rules.required]"
                                        v-model="name">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-btn
                                    type="submit"
                                    color="primary">
                                    Save
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>

                    </v-card>
                    <v-alert
                        :value = passSuccess
                        type="success">
                        <span color="white">Password successfully changed.</span>
                    </v-alert>
                    <v-alert
                        :value = passFail
                        type="error">
                        <span color="white">Old Password Incorrect.</span>
                    </v-alert>
                    <v-alert
                        :value = passError
                        type="error">
                        <span color="white">An Error Has Occurred. Please Try Again Later.</span>
                    </v-alert>

                </v-tab-item>

                <v-tab ripple>
                    Password
                </v-tab>
                <v-tab-item class="pt-2">
                    <v-card flat>
                        <v-card-title primary-title>
                            <h3 class="headline mb-0"> Change Password </h3>
                        </v-card-title>
                        <form @submit.prevent="resetPass">
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                        type="password"
                                        label="Enter Old Password"
                                        name="oldpassword"
                                        id="oldpassword"
                                        v-model="oldpassword">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                        type="password"
                                        label="Enter New Password"
                                        name="newpassword"
                                        id="newpassword"
                                        v-model="newpassword">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                        type="password"
                                        label="Confirm New Password"
                                        name="confirmpassword"
                                        id="confirmpassword"
                                        v-model="confirmpassword">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-btn
                                    :disabled="!passwordIsValid"
                                    type="submit">
                                    Submit
                                    </v-btn>
                                </v-flex>
                                <v-flex v-if="!passwordIsValid">
                                    <span>New Passwords do Not Match.</span>
                                </v-flex>
                            </v-layout>
                        </form>
                        <v-btn @click = "forgotLog">Forgot Password?</v-btn>

                    </v-card>
                    <v-alert
                        :value = passSuccess
                        type="success">
                        <span color="white">Password successfully changed.</span>
                    </v-alert>
                    <v-alert
                        :value = passFail
                        type="error">
                        <span color="white">Old Password Incorrect.</span>
                    </v-alert>
                    <v-alert
                        :value = passError
                        type="error">
                        <span color="white">An Error Has Occurred. Please Try Again Later.</span>
                    </v-alert>

                </v-tab-item>
                <v-tab ripple>
                    Email
                </v-tab>
                <v-tab-item class="pt-2">
                    <v-card flat>
                        <v-card-title primary-title>
                            <h3 class="headline mb-0"> Change Email </h3>
                        </v-card-title>
                        <v-form @submit.prevent="changeUserEmail">
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                        label="Enter New Email"
                                        name="email"
                                        id="email"
                                        v-model="email">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                        type = "password"
                                        label="Enter Password"
                                        name="epass"
                                        id="epass"
                                        v-model="epass">
                                    </v-text-field>
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
                        :value = emailSuccess
                        type="success">
                        <span color="white">Email successfully updated.</span>
                    </v-alert>
                    <v-alert
                        :value = emailFail
                        type="error">
                        <span color="white">Password Incorrect.</span>
                    </v-alert>
                    <v-alert
                        :value = emailError
                        type="error">
                        <span color="white">An Error Has Occurred. Please Try Again Later.</span>
                    </v-alert>
                </v-tab-item>
                <v-tab ripple>
                   Phone
                </v-tab>
                <v-tab-item class="pt-2">
                    <v-card flat>
                        <v-form @submit.prevent="setPhone" ref="detailsForm">
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                        type="text"
                                        label="Your Phone Number"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        :rules="[rules.required]"
                                        v-model="phone">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-btn
                                    type="submit"
                                    color="primary">
                                    Save
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>

                    </v-card>
                    <v-alert
                        :value = phoneSuccess
                        type="success">
                        <span color="white">Phone number successfully updated.</span>
                    </v-alert>

                </v-tab-item>
            </v-tabs>

		</v-flex>
	</v-layout>
</template>

<script>
    import { Auth, db } from '~/plugins/firebase-client-init.js'
    import firebase from 'firebase/app'

	export default {
        name: "profile",
		data: function() {

		    return {
                name: this.$store.getters['auth/activeUser'].displayName || null,

                email: this.$store.getters['auth/activeUser'].email,
                //phone: this.$store.getters['auth/activeUser'].phoneNumber || null,
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
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    }
                }
            }
        },
        methods: {
            async updateDetails() {
                if(this.$refs.detailsForm.validate()){
                    // console.log(this.phone, this.name);
                    let user = Auth.currentUser;

                    /**
                     * Can't set phoneNumber here
                     * @url https://www.reddit.com/r/Firebase/comments/70slpi/can_you_update_phonenumber_from_userprofile/
                     */
                    await user.updateProfile({ // @todo Move this to Vuex
                        displayName: this.name,
                        // phoneNumber: this.phone,
                    });
                    this.$store.commit('auth/setUser', user);
                    this.$toast.success('Profile Saved!');
                }

            },
            resetPass() {
                firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(
                firebase.auth.EmailAuthProvider.credential(
                    firebase.auth().currentUser.email,
                    this.oldpassword
                    )
                ).then(
                    success => {
                        var user = firebase.auth().currentUser;
                        var newPassword = this.newpassword

                        user.updatePassword(newPassword).then(
                            success => {
                                //console.log("success, new password:", this.newpassword)
                                this.passSuccess = true;

                        // Update successful.
                        }).catch(function(error) {
                            console.log("unknown error")
                            this.passError = true;
                        // An error happened.
                        });
                    }
                ).catch(error => {
                    //console.log("error")
                    this.passFail = true;
                });
            },
            changeUserEmail() {
                firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(
                firebase.auth.EmailAuthProvider.credential(
                    firebase.auth().currentUser.email,
                    this.epass
                    )
                ).then(
                    success => {
                        var user = firebase.auth().currentUser;
                        user.updateEmail(this.email).then(
                            success => {
                            this.emailSuccess = true;
                            //console.log("email updated")
                        // Update successful.
                        }).catch(function(error) {
                            //console.log("error after reauthenticate")
                        });
                    }
                ).catch(error => {
                    this.emailFail = true;
                    //console.log("error before reauthenticate")
                });
            },
            async forgotLog() {
                await this.$store.dispatch('auth/signOut');
                this.$router.replace('/password')
            },
            async setPhone() {
                if (this.phone !== null) {
                    // Update phone number on the server
                    await db.collection('user-meta').doc(this.$store.getters['auth/activeUser'].uid).set({
                        phone: this.phone
                    }, { merge: true });

                    // Update in local store
                    this.$store.commit('meta/setPhone', this.phone)
                    this.phoneSuccess = true;
                }

            }
        },
        computed: {
            user() {
                return Auth.currentUser;
            },
            nameIsValid() {
                return this.name !== "";
            },
            passwordIsValid() {
                //text fields empty
                if (this.newpassword == '' && this.confirmpassword == '')
                    return false;
                //text fields do not match
                if (this.newpassword !== this.confirmpassword)
                    return false;
                //else return true
                else
                    return true;

                 //return this.password !== '' &&
                        //this.confirmpassword !== '' &&
                        //this.password == this.confirmpassword;

            },
            emailIsValid() {
                return this.email !== "" && this.password != "";
            },
            giveEmail() {
                var user = firebase.auth().currentUser;
                return this.user.email
            },
            giveName() {
                console.log("name:", this.user.name)
                return this.user.name
            }
        },
        mounted() {
            // console.log(Auth.currentUser);
        }
	}
</script>

<style scoped>

</style>
