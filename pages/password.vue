<template>
    <v-layout>
        <v-flex xs12 sm6 offset-sm3>
            <h3>Password Reset Page</h3>
            <form @submit.prevent="resetPass">
                <v-layout>
                    <v-flex>
                        <v-text-field 
                            label="Enter Email"
                            name="email"
                            id="email"
                            v-model="email">
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex>
                        <v-btn 
                        :disabled="!emailIsValid"
                        type="submit"
                        @click="success = true">
                        Submit
                        </v-btn>
                    </v-flex>
                </v-layout>
            </form>
            <v-flex>
                <span v-if="success">An email has been sent to the provided address.</span>
            </v-flex>
            <v-btn to="/resetpassword?test=01">Testing</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
    import { Auth } from '~/plugins/firebase-client-init.js'
    export default {
        name: "password",
        auth: false,
        data() {
            return {
                email: '',
                success: false,
            }
        },
        computed: {
            emailIsValid () {
                return this.email !== '';
            }
        },
        methods: {
            resetPass() {
                var emailAddress = this.email;
                Auth.sendPasswordResetEmail(emailAddress).then(function() {
                 //Email sent.
                }).catch(function(error) {
                 //An error happened.
                });
                return
            },
            emailSuccess() {
                this.success = true;
            }
        }

    }
</script>

<style scoped>

</style>
