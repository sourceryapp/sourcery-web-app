<template>
	<div>
		<div class="info" v-if="request !== null">
			<h1>{{request.label}}</h1>
			<p>{{request.due_date }}</p>
			<p>Status: {{request.status}}</p>
		</div>
	</div>
</template>

<script>
	import axios from "axios";

	export default {
		name: "request-id",
		data() {
			return {
				request: null
			}
		},
		mounted() {
			if (process.browser) {
				console.log('requesting request')
				//console.log(axios.defaults.headers.common['Authorization'])
				axios.get(process.env.API_URL + 'request/' + this.$route.params.id).then(res => {
					this.request = res.data
				}).catch(err => {
					console.log(err)
				})
			}
		}

	}
</script>

<style scoped>

</style>