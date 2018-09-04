<template>
	<main role="main">
		<h1>Tube</h1>
		<ul>
			<li>
				<nuxt-link :to="{name: 'login'}">Login</nuxt-link>
			</li>
			<li>
				<nuxt-link :to="{name: 'register'}">Register</nuxt-link>
			</li>
		</ul>
	</main>
</template>

<script>
	export default {
		name: 'home',
		layout: 'default',
		components: {},
		mounted() {
			if (process.browser) {
				window.onNuxtReady(() => {
				})
			}
		}
	}
</script>

<style>

</style>
