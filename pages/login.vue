<template>
	<v-layout>
        <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
            <v-form @submit.prevent="login">
                <h1>Log In</h1>
                <v-alert
                    :value = loginError
                    type="error"
                    transition="slide-y-transition"
                    outline>
                    Username or password is incorrect.
                </v-alert>
                <v-text-field 
                    type="email"
                    name="email"
                    v-model="email" 
                    label="Email" 
                    :rules="emailRules"
                    required
                    clearable
                    validate-on-blur
                    prepend-icon="email"
                    autofocus
                ></v-text-field>
                <span class="text-red" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
                <v-text-field 
                    name="password" 
                    v-model="password" 
                    label="Password"
                    required
                    :type="showPass ? 'text' : 'password'"
                    :append-icon="showPass ? 'visibility' : 'visibility_off'"
                    @click:append="showPass = !showPass"
                    :rules="[v => !!v || 'Password is required']"
                    prepend-icon="security"
                    validate-on-blur
                ></v-text-field>
                <span class="text-red" v-for="(err, index) in errors.password" :key="index">{{err}}</span>
                
                <v-btn block type="submit" color="primary" :loading="loading" :disabled="loading">Log In</v-btn>
                <v-btn block flat to="/password">Forgot password?</v-btn>

                <v-divider class="mt-3 mb-3"></v-divider>

                <h3>Don't Have an Account?</h3>
                <v-btn block outline color="primary" to="/register">Register</v-btn>


            </v-form>
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
                valid: true,
                email: '',
                emailRules: [
                    v => !!v || 'Email is required',
                    v => /.+@.+/.test(v) || 'Email must be valid',
                ],
                password: '',
                showPass: false,
                loginError: false,
                loading: false,
				errors: {
					password: [],
					email: []
                },
                errorMessage: ''
			}
		},
		methods: {

            async login() {
                this.loading = true;
				this.loginError = false;
                await this.$store.dispatch('auth/signIn', {
                    email: this.email,
                    password: this.password
                }).then(function() {
					console.log('success');
				}).catch(error => {
					console.log("Error code:", error.code, "Error message", error.message);
                    this.loginError = true;
                    this.loading = false;
				});
                this.$router.push({ name: 'dashboard' })
            }
		}
	}
</script>

<style scoped>

</style>
