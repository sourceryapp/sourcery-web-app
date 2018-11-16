<template>
	<div>
		<div v-if="request !== null">
			<h1>{{request.label}}</h1>
			<p>Citation:</p>
			<pre class="mb-2">{{request.citation}}</pre>
			<p>Repository: <strong>{{request.repository}}</strong></p>
			<p>Status: <strong>{{request.status}}</strong></p>
			<div v-if="request.vendor !== null">
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
                <v-btn color="primary" @click="message=true">Delete?</v-btn>
			</p>
            <v-dialog
                v-model="message"
                width="500"
                >
                <v-card>
                    <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                    >
                    What are the options?
                    </v-card-title>

                    <v-card-text>
                        <p>Can the user delete or edit?</p>
                        <p>Maybe conditionally?</p>

                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        flat
                        @click="message = false"
                    >
                        Close
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
		</div>
	</div>
</template>

<script>

	export default {
		name: "request-id",
		data() {
			return {
                request: null,
                message: false
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
