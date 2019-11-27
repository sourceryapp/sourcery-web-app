<template>
	<v-layout>
        <v-flex  xs12 sm6 offset-sm3 md4 offset-md4>
            <v-form @submit.prevent="login">
                <h1>Log In</h1>
                <v-text-field type="email" name="email" v-model="email" placeholder="Email"></v-text-field>
                <span class="text-red" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
                <v-text-field type="password" name="password" v-model="password" placeholder="Password"></v-text-field>
                <span class="text-red" v-for="(err, index) in errors.password" :key="index">{{err}}</span>

                <v-btn type="submit" color="primary">Log In</v-btn>

                <v-divider class="mt-3 mb-3"></v-divider>

                <h3>Forgot Your Password?</h3>
                <v-btn to="/password">Reset Password</v-btn>


                <v-divider class="mt-3 mb-3"></v-divider>

                <h3>Don't Have an Account?</h3>
                <v-btn to="/register">Register</v-btn>


            </v-form>
            <v-alert
                :value = loginError
                type="warning"
                dismissible>
                <span color="white">Invalid login, please try again.</span>
            </v-alert>
        </v-flex>

	</v-layout>
</template>

<script>
	export default {
		name: "login",
		middleware: ['auth'],
		layout: 'default',
		data() {
			return {
				email: '',
				password: '',
				loginError: false,
				errors: {
					password: [],
					email: []
				},
			}
		},
		methods: {

            async login() {
				this.loginError = false;
                await this.$store.dispatch('auth/signIn', {
                    email: this.email,
                    password: this.password
                }).then(function() {
					//console.log('success');
				}).catch(error => {
					//console.log("error");
					this.loginError = true;
				});
                this.$router.push({ name: 'dashboard' })
            }
		}
	}
</script>

<style scoped>

</style>
