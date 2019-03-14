<template>
    <v-layout>
        <v-flex xs12 sm6 offset-sm3>
            <h3>Reset Password</h3>
            <p>Enter your email address and click submit. An email instructing you of how to change your password will be sent shortly.<p>
            <form @submit.prevent="resetPassEmail">
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
            <v-btn to="/login">Back</v-btn>
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
            user() {
                return this.$store.getters.activeUser
        },
        methods: {
            resetPassEmail() {
                var error_msg = true;
                var emailAddress = this.email;
                Auth.sendPasswordResetEmail(emailAddress).then(function() {
                    error_msg = false;
                    console.log("success")
                 //Email sent.
                }).catch(function(error) {
                    if (error_msg == true)
                        console.log("oops")
                 //An error happened.
                });
                return
            },
            emailSuccess() {
                this.success = true;
            },
            returnAndLog() {
                //console.log(this.user)
                //if (this.user) {
                    this.$store.dispatch('signOut')
                //  }
                this.$router.replace('/login')
            }
        }

    }
</script>

<style scoped>

</style>
