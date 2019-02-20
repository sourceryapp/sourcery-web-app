<template>
    <v-layout>
        <v-flex xs12 sm6 offset-sm3>
            <h1>Reset Pass</h1>
            <form @submit.prevent="resetPass">
                <v-layout>
                    <v-flex>
                        <v-text-field
                            label="Enter Password"
                            name="password"
                            id="password"
                            v-model="password">
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex>
                        <v-text-field
                            label="Confirm Password"
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
            <v-btn :to="{name: 'login'}">Return</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
    import { Auth } from '~/plugins/firebase-client-init.js'
    export default {
        name: "resetpass",
        auth: false,
        data() {
            return {
                password: '',
                confirmpassword: '',
                mismatch_password: false,
            }
        },
        methods: {
            getUrlVars() {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                    vars[key] = value;
                });
                return vars["test"];
            },
            resetPass(){
                var code = getUrlVars();
                var newPasswprd = this.password();
                firebase.auth().confirmPasswordReset(code, newPassword)
                    .then(function() {
                        console.log(success)

                    // Success
                    })
                    .catch(function() {
                    // Invalid code
                })
            }
        },
        computed: {
            passwordIsValid() {
                //text fields empty
                if (this.password == '' && this.confirmpassword == '')
                    return false;
                //text fields do not match
                if (this.password !== this.confirmpassword)
                    return false;
                //else return true
                else
                    return true;
                 
                 //return this.password !== '' &&
                        //this.confirmpassword !== '' &&
                        //this.password == this.confirmpassword;
       
            }
        }
    }
</script>

<style scoped>
</style>