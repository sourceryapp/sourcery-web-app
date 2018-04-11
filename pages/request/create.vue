<template>
	<div>
		<h1>Create Request</h1>
		<div>
			<p>Give a label for this request</p>
			<input type="text" v-model="label" class="border-2">
			<p class="text-red" v-for="(err, index) in errors.label" :key="index">{{err}}</p>
		</div>
		<div>
			<p>Where is your document located?</p>
			<p><input type="text" v-model="repository" @keyup="updateQuery" class="border-2"></p>
			<ul v-if="suggestions.length > 0 && repository !== ''">
				<li v-for="(suggestion, index) in suggestions" :key="index">
					<a href="#" @click.prevent="selectSuggestion(suggestion)">{{suggestion}}</a>
				</li>
			</ul>
			<p class="text-red" v-for="(err, index) in errors.repository" :key="index">{{err}}</p>
		</div>
		<div>
			<p class="mt-2">What is the citation for your document?</p>
			<textarea name="citation" id="citation" cols="30" rows="10" v-model="citation" class="border-2"></textarea>
			<p class="text-red" v-for="(err, index) in errors.citation" :key="index">{{err}}</p>
		</div>
		<div>
			<p>By clicking this button, you agree to pay the base rate of <strong>$5</strong>.</p>
			<p>Once picked up, it is estimated that your request will cost around <strong>$10</strong>, making your
				total cost <strong>$15.</strong></p>
			<p>You will be charged immediately for the base rate, and charged once it is picked up for the rest.</p>
			<p v-if="loading"><strong>Loading...</strong></p>
			<button @click.prevent="submitRequest" class="p-2 bg-blue text-white" v-else>Submit</button>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "create",
		data() {
			return {
				label: '',
				repository: '',
				suggestions: [],
				citation: '',
				loading: false,
				errors: {
					label: [],
					repository: [],
					citation: [],
				},

			}
		},
		methods: {
			updateQuery() {
				axios.post(process.env.API_URL + 'repositories/search', {
					data: {
						query: this.query
					}
				}).then(res => {
					this.suggestions = res.data.repositories
				}).catch(err => {
					this.suggestions = []
					console.log(err)
					console.log(err.response)
				})
			},
			selectSuggestion(suggestion) {
				this.suggestions = []
				this.repository = suggestion
			},
			submitRequest() {
				this.errors.citation = []
				this.errors.repository = []
				this.errors.label = []
				this.loading = true
				axios.post(process.env.API_URL + 'requests', {
					label: this.label,
					repository: this.repository,
					citation: this.citation,
					client_id: this.$store.state.auth.user.id,
				}).then(res => {
					this.loading = false
					console.log(res)
					this.$store.dispatch('auth/setUser').then(() => {
						this.$router.push({name: 'home'})
					})
				}).catch(err => {
					this.loading = false
					console.log(err)
					console.log(err.response)
					if (err.response.status === 422) {
						const errors = err.response.data
						this.errors.citation = errors.citation
						this.errors.repository = errors.repository
						this.errors.label = errors.label
					}
				})
			}
		}
	}
</script>

<style scoped>

</style>