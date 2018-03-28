<template>
	<container>
		<nav>
			<ul>
				<li>
					<a href="#" @click.prevent="logout">Log Out</a>
				</li>
				<li>
					<nuxt-link :to="{name: 'home'}" v-if="user">Home</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'vendor'}" v-if="user && user.vendor == true">Vendor Area</nuxt-link>
					<nuxt-link :to="{name: 'register-vendor'}" v-else>Become a Vendor</nuxt-link>
				</li>
			</ul>
		</nav>
		<nuxt/>
	</container>
</template>

<script>
	import * as grid from '~/components/grid'

	export default {
		components: {
			...grid
		},
		computed: {
			user() {
				return this.$store.state.auth.user
			}
		},
		methods: {
			logout() {
				this.$store.dispatch('auth/logout').then(() => {
					this.$router.push({name: 'login'})
				})
			}
		}
	}
</script>

<style>

</style>
