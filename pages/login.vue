<template>
	<main role="main">
		<h1>Tube - Login</h1>
		<form @submit.prevent="loginSubmit">
			<input type="email" name="email" v-model="email" placeholder="Email" class="border-2 block mt-2">
			<span class="text-red" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
			<input type="password" name="password" v-model="password" placeholder="Password"
			       class="border-2 block mt-2">
			<span class="text-red" v-for="(err, index) in errors.password" :key="index">{{err}}</span>
			<input type="submit" class="block bg-blue p-2 text-white mt-2 hover:bg-blue-dark">
			<nuxt-link :to="{name: 'register'}" class="bg-blue p-2 text-white mt-2 hover:bg-blue-dark ">Register</nuxt-link>
		</form>
	</main>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "login",
		layout: 'guest',
		data() {
			return {
				email: 'timthewebguy@gmail.com',
				password: 'password',
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