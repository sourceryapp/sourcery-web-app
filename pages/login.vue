<template>
	<v-form @submit.prevent="login">
         <h1>Log In</h1>
        <v-text-field type="email" name="email" v-model="email" placeholder="Email"></v-text-field>
        <span class="text-red" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
        <v-text-field type="password" name="password" v-model="password" placeholder="Password"></v-text-field>
        <span class="text-red" v-for="(err, index) in errors.password" :key="index">{{err}}</span>
        <div>
            <nuxt-link  :to="{name: 'password'}">Forgot your password?</nuxt-link>
        </div>
        <v-btn type="submit" color="primary" @click.prevent="login">Log In</v-btn>

        <v-divider class="mt-3 mb-3"></v-divider>

        <h3>Don't Have an Account?</h3>
        <v-btn :to="{name: 'register'}">Register</v-btn>


	</v-form>
</template>

<script>
	export default {
		name: "login",
		// auth: false,
		middleware: ['auth'],
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
		// computed: {
         //    redirect() {
         //        return (
         //            this.$route.query.redirect &&
         //            decodeURIComponent(this.$route.query.redirect)
         //        )
         //    }
		// },
		methods: {
			// loginSubmit() {
			// 	axios.post(process.env.API_URL + 'auth/login', {
			// 		email: this.email,
			// 		password: this.password
			// 	}).then(res => {
			// 		this.errors = {password: [], email: []}
			// 		this.$store.dispatch('auth/login', {token: res.data.data.token}).then(() => {
			// 			this.$router.push({name: 'home'})
			// 		})
			// 	}).catch(err => {
			// 		if (err.response.status === 401) {
			// 			this.errors.password = ['Invalid Username and/or Password']
			// 		} else if (err.response.status === 422) {
			// 			this.errors.email = err.response.data.email || []
			// 			this.errors.password = err.response.data.password || []
			// 		}
			// 	})
			// }

            async login() {
                this.error = null
                return this.$auth
                    .loginWith('local', {
                        data: {
                            email: this.email,
                            password: this.password
                        }
                    })
                    .catch(e => {
                        this.error = e + ''
                    })
            }
		}
	}
</script>

<style scoped>

</style>
