<template>
	<v-form @submit.prevent="loginSubmit">
		<h1>Login</h1>
		<v-text-field type="email" name="email" v-model="email" placeholder="Email"></v-text-field>
			<span class="text-red" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
				<v-text-field type="password" name="password" v-model="password" placeholder="Password"></v-text-field>
			<span class="text-red" v-for="(err, index) in errors.password" :key="index">{{err}}</span>
		<v-btn type="submit" color="primary">Submit</v-btn>
			<nuxt-link :to="{name: 'register'}">Register</nuxt-link>
	</v-form>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "login",
		layout: 'default',
		data() {
			return {
				email: 'brian@uconn.edu',
				password: 'Research1!',
				errors: {
					password: [],
					email: []
				},
			}
		},
		methods: {
			loginSubmit() {
				axios.post(process.env.API_URL + 'auth/login', {
					email: this.email,
					password: this.password
				}).then(res => {
					this.errors = {password: [], email: []}
					this.$store.dispatch('auth/login', {token: res.data.data.token}).then(() => {
						this.$router.push({name: 'home'})
					})
				}).catch(err => {
					if (err.response.status === 401) {
						this.errors.password = ['Invalid Username and/or Password']
					} else if (err.response.status === 422) {
						this.errors.email = err.response.data.email || []
						this.errors.password = err.response.data.password || []
					}
				})
			}
		}
	}
</script>

<style scoped>

</style>