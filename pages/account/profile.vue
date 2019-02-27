<template>
	<v-layout row>
		<v-flex xs12 sm6 offset-sm3>
            <h1>Profile</h1>

            <v-tabs
                    slider-color="primary"


            >
                <v-tab ripple>
                    General
                </v-tab>
                <v-tab-item class="pt-2">
                    
                    <v-card flat height="140px">
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0"> Current Information </h3>
                                    <p>Name: {{this.user.name}}</p>
                                    <p>Email: {{this.user.email}}</p>
                            </div>
                        </v-card-title>
                    </v-card>

                    <v-card flat>
                        <v-card-title primary-title>
                            <h3 class="headline mb-0"> Change Name </h3>
                        </v-card-title>
                        <v-form @submit.prevent="changeUserName">
                            <v-layout>
                                <v-flex>
                                    <v-text-field 
                                        label="Enter Name"
                                        name="name"
                                        id="name"
                                        v-model="name">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-btn 
                                    :disabled="!nameIsValid"
                                    type="submit"
                                    >
                                    Submit
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-card>
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
                            </v-layout>  
                        </form>
                    </v-card>
                    <v-alert
                        :value = passSuccess
                        type="success">
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
                        <v-form @submit.prevent="changeUserName">
                            <v-layout>
                                <v-flex>
                                    <v-text-field 
                                        label="Enter Name"
                                        name="name"
                                        id="name"
                                        v-model="name">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-btn 
                                    :disabled="!nameIsValid"
                                    type="submit"
                                    >
                                    Submit
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-card>
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
                oldpassword: 'passwordtest01',
                newpassword: 'passwordtest01',
                confirmpassword: 'passwordtest01',
                passSuccess: false,

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
                        // An error happened.
                        });
                    }
                ).catch(function(error) {

                });
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
            //reAuthenticate() {
                //var user = firebase.auth().currentUser;
                //var credential = firebase.auth.EmailAuthProvider.credential(
                 //   this.user.email,
                //    oldpassword
                //);

                // Prompt the user to re-provide their sign-in credentials

               // user.reauthenticateAndRetrieveDataWithCredential(credential).then(
               //     success => {
                //        return true 
                //}).catch(function(error) {
                //        return false
                // An error happened.
               // });

            //}
		},
	}
</script>

<style scoped>

</style>
