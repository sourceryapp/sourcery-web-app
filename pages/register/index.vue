<template>
	<main role="main">
		<h1>Tube - Register</h1>
		<form @submit.prevent="registerSubmit">
			<input type="text" name="name" v-model="name" placeholder="Name" class="border-2 block mt-2">
			<span class="text-red" v-for="(err, index) in errors.name" :key="index">{{err}}</span>
			<input type="email" name="email" v-model="email" placeholder="Email" class="border-2 block mt-2">
			<span class="text-red" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
			<input type="password" name="password" v-model="password" placeholder="Password"
			       class="border-2 block mt-2">
			<span class="text-red" v-for="(err, index) in errors.password" :key="index">{{err}}</span>
			<input type="password" name="confirm_password" v-model="confirm_password" placeholder="Confirm Password"
			       class="border-2 block mt-2">
			<span class="text-red" v-for="(err, index) in errors.confirm_password" :key="index">{{err}}</span>
			<input type="submit" class="block bg-blue p-2 text-white mt-2 hover:bg-blue-dark" value="Next">
		</form>
	</main>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "register",
		layout: 'guest',
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