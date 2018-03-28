<template>
	<div>
		<h1>Choose your type</h1>
		<nuxt-link :to="{name: 'register-client'}" class="block">I'm looking for documents</nuxt-link>
		<nuxt-link :to="{name: 'register-vendor'}" class="block">I'm looking for money</nuxt-link>
	</div>
</template>

<script>
	export default {
		name: "type"
	}
</script>

<style scoped>

</style>