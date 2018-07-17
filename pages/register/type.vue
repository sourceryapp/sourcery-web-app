<template>
	<div>
		<h1>Choose your type</h1>
		<ul>
            <li><nuxt-link :to="{name: 'register-client'}" class="block">I'm looking for documents</nuxt-link></li>
            <li><nuxt-link :to="{name: 'register-vendor'}" class="block">I'm looking for money</nuxt-link></li>
        </ul>
	</div>
</template>

<script>
	export default {
		name: "type"
	}
</script>

<style scoped>

</style>