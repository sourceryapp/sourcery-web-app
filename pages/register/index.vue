<template>
	<v-form @submit.prevent="registerSubmit">
		<h1>Register</h1>
		<v-text-field type="text" name="name" v-model="name" label="Name"></v-text-field>
		<span class="red--text" v-for="(err, index) in errors.name" :key="index">{{err}}</span>
		<v-text-field type="email" name="email" v-model="email" label="Email"></v-text-field>
		<span class="red--text" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
		<v-text-field type="password" name="password" v-model="password" label="Password" autocomplete="false" hint="At least 8 characters"></v-text-field>
		<v-text-field type="password" name="confirm_password" v-model="confirm_password" label="Confirm Password"></v-text-field>
		<span class="red--text" v-for="(err, index) in errors.confirm_password" :key="index">{{err}}</span>
		<v-btn type="submit" value="Next" color="primary">Next</v-btn>
	</v-form>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "register",

        /**
		 * Don't require auth for this page.
         */
		auth: false,
		data() {
			return {
				name: '',
				email: '',
				password: '',
				confirm_password: '',
				errors: {
					name: [],
					email: [],
					password: [],
					confirm_password: [],
				},
			}
		},
		methods: {
			registerSubmit() {
				if (this.password !== this.confirm_password) {
					this.errors.confirm_password = ['Passwords must be the same']
				} else {
					axios.post(process.env.API_URL + 'auth/register', {
						name: this.name,
						email: this.email,
						password: this.password,
					}).then(res => {
						this.errors = {name: [], password: [], email: []}
						axios.post(process.env.API_URL + 'auth/login', {
							email: this.email,
							password: this.password,
						}).then(() => {
							this.$store.dispatch('auth/login', {token: res.data.data.token}).then(() => {
								this.$router.push({name: 'test'})
							})
						})
					}).catch(err => {
						this.errors.name = err.response.data.name || []
						this.errors.email = err.response.data.email || []
						this.errors.password = err.response.data.password || []
					})
				}
			}
		}
	}
</script>

<style scoped>

</style>