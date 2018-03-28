<template>
	<container>
		<nuxt/>
	</container>
</template>

<script>
	import * as grid from '~/components/grid'

	export default {
		name: "guest",
		components: {
			...grid,
		}
	}
</script>

<style scoped>

</style>