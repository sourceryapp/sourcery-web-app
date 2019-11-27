<template>
    <v-layout>
        <v-flex xs12 sm6 offset-sm3>
            <v-alert
                :value="error"
                class="my-3"
                type="error">
                <span color="white">{{error.message}}</span>
            </v-alert>
            <v-alert
                :value="success"
                class="my-3"
                type="success">
                <span color="white">An email has been sent to the provided address.</span>
            </v-alert>

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
                <v-layout row align-center justify-center>
                    <v-btn to="/login">Back</v-btn>
                    <v-btn
                    type="submit"
                    color="primary"
                    >
                    Submit
                    </v-btn>
                </v-layout>
            </form>
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
                error: false
            }
        },
        computed: {
            user() {
                return this.$store.getters['auth/activeUser']
            }
        },
        methods: {
            resetPassEmail() {
                this.success = false;
                this.error = false;
                Auth.sendPasswordResetEmail(this.email).then(() => {
                    this.success = true;
                    this.email = '';
                }).catch((error) => {
                    this.error = error;
                });
                return
            },
            returnAndLog() {
                this.$store.dispatch('auth/signOut')
                this.$router.replace('/login')
            }
        }

    }
</script>

<style scoped>

</style>
