<template>
	<div>
		<div v-if="request !== null">
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
			<p class="text-xs-center">

        <v-btn color="primary" to="/"><v-icon dark>arrow_back_ios</v-icon> Back</v-btn>
                <v-btn color="primary" to="/">Edit</v-btn>
                <v-btn color="primary" to="/">Delete?</v-btn>
			</p>
		</div>
	</div>
</template>

<script>

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
				this.$axios.get('/requests/' + this.$route.params.id).then(res => {
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
