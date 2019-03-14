<template>
	<v-layout row>
		<v-flex xs12 sm6 offset-sm3>
            <h1>Profile</h1>

            <v-tabs
                    slider-color="primary"


            >
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
            </v-tabs>

		</v-flex>
	</v-layout>
</template>

<script>
    import { Auth } from '~/plugins/firebase-client-init.js'
    import firebase from 'firebase/app'

	export default {
		name: "profile",
		data: function() {

		    return {
                name: '',

                email: '',
                epass: '',
                emailSuccess: false,
                emailFail: false,
                emailError: false,

                oldpassword: '',
                newpassword: '',
                confirmpassword: '',
                passSuccess: false,
                passFail: false,
                passError: false
            }
        },
        methods: {
            changeUserName() {
                var user = firebase.auth().currentUser;
                console.log(this.user.name);
                user.updateProfile({
                    displayName: name,
                }).then(function() {
                // Update successful.
                }).catch(function(error) {
                // An error happened.
                });
                console.log(this.user.displayName);
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
                await this.$store.dispatch('signOut');
                this.$router.replace('/password')
            }

        },
        computed: {
            user() {
                return this.$store.getters.activeUser
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
		}
	}
</script>

<style scoped>

</style>
