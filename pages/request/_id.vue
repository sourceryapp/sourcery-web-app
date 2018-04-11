<template>
	<div>
		<div class="info" v-if="request !== null">
			<h1>{{request.label}}</h1>
			<p>Citation:</p>
			<pre class="mb-2">{{request.citation}}</pre>
			<p>Repository: <strong>{{request.repository}}</strong></p>
			<p>Status: <strong>{{request.status}}</strong></p>
			<div v-if="request.status === 'picked_up' || request.status === 'completed'">
				<p>Vendor: <strong>{{request.vendor.name}}</strong></p>
			</div>
			<div v-if="request.status === 'completed'">
				<h1>Images: </h1>
				<ul>
					<li v-for="(image, index) in request.attachments" :key="index">
						<img :src="image.file" :alt="`Request Result ${index}`">
					</li>
				</ul>
			</div>
			<p>
				<nuxt-link :to="{name: 'home'}">Back</nuxt-link>
			</p>
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