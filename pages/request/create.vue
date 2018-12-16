<template>
		<!--<div>-->
			<!--<p>Give a label for this request</p>-->
			<!--<input type="text" v-model="label" class="border-2">-->
			<!--<p class="text-red" v-for="(err, index) in errors.label" :key="index">{{err}}</p>-->
		<!--</div>-->
		<!--<div>-->
			<!--<p>Where is your document located?</p>-->
			<!--<p><input type="text" v-model="repository" @keyup="updateQuery" class="border-2"></p>-->
			<!--<ul v-if="suggestions.length > 0 && repository !== ''">-->
				<!--<li v-for="(suggestion, index) in suggestions" :key="index">-->
					<!--<a href="#" @click.prevent="selectSuggestion(suggestion)">{{suggestion}}</a>-->
				<!--</li>-->
			<!--</ul>-->
			<!--<p class="text-red" v-for="(err, index) in errors.repository" :key="index">{{err}}</p>-->
		<!--</div>-->
		<!--<div>-->
			<!--<p class="mt-2">What is the citation for your document?</p>-->
			<!--<textarea name="citation" id="citation" cols="30" rows="10" v-model="citation" class="border-2"></textarea>-->
			<!--<p class="text-red" v-for="(err, index) in errors.citation" :key="index">{{err}}</p>-->
		<!--</div>-->
		<!--<div>-->
			<!--<p>By clicking this button, you agree to pay the base rate of <strong>$5</strong>.</p>-->
			<!--<p>Once picked up, it is estimated that your request will cost around <strong>$10</strong>, making your-->
				<!--total cost <strong>$15.</strong></p>-->
			<!--<p>You will be charged immediately for the base rate, and charged once it is picked up for the rest.</p>-->
			<!--<p v-if="loading"><strong>Loading...</strong></p>-->
			<!--<button @click.prevent="submitRequest" class="p-2 bg-blue text-white" v-else>Submit</button>-->
		<!--</div>-->
        <v-layout row>







            <v-flex xs12 sm8 offset-sm2>



                <h1 style="width:100%">Create Request</h1>

                <v-alert
                    :value="true"
                    type="info"
                    class="mt-4 mb-4"
                    >
                    Message about our limited service area?
                </v-alert>

                <label for="area" class="title">
                    1. Where is your document located?
                </label>
                <v-select
                id="area"
                name="area"
                :items="areaSelections"
                item-text="value"
                item-value="key"
                label="City, State"
                v-model="area"
                >Loading...</v-select>

                <v-select
                id="location"
                name="location"
                :items="repositories"
                v-if="area"
                item-text="name"
                item-value="id"
                label="Choose a location"
                v-model="request.repository_id"
                >Loading...</v-select>


                <v-divider class="mt-4 mb-4"></v-divider>


                <label for="citation"  class="title">
                    2. What is the citation for your document?
                </label>
                <v-textarea
                    style="font-family: Times"
                    id="citation"
                    name="citation"
                    label="Citation"
                    multi-line="true"
                    placeholder="Example: Howard, Richard, translator. Madness and Civilization: A History of Insanity in the Age of Reason. By Michel Foucault, Vintage-Random House, 1988."
                    v-model="request.citation"
                    auto-grow
                ></v-textarea>


                <v-divider class="mt-4 mb-4"></v-divider>

                <label for="pages"  class="title">
                    3. Number of Pages Requested
                </label>
                <v-layout>
                    <v-flex xs6 >
                        <p>You will be charged immediately for the base rate, and charged once it is picked up for the rest.</p>
                        <v-select
                            id="pages"
                            name="pages"
                            v-model="request.pages"
                            :items="pages"
                            label="Maximum Pages"
                        ></v-select>
                    </v-flex>
                    <v-flex xs5 offset-xs1>
                        <p class="caption mb-0 primary--text">Cost Will Not Exceed</p>
                        <h1 class="pt-0">$ {{ estimatedCost }}</h1>
                    </v-flex>
                </v-layout>

                    <v-btn
                    :disabled="loading"
                    @click="submitRequest"
                    class="primary"
                    >
                    Submit
                    </v-btn>

            </v-flex>

        </v-layout>





</template>

<script>

import { db } from '~/plugins/firebase-client-init.js'

	export default {
		name: "create",
		data() {
			return {
                repositories: ["Loading..."],
                request: {
                    pages: 0,
                    citation: 'Wysocki, Anne Frances, et al. Writing New Media: Theory and Applications for Expanding the Teaching of Composition. Utah State UP, 2004.'
                },
			    active: null,
				suggestions: [],
				loading: false,
				errors: {
					label: [],
					repository: [],
					citation: [],
				},
                numPages: 0,
                pages: [
                    5,
                    10,
                    15,
                    20,
                    25,
                    30,
                    "Unlimited"
                ],
                area: null
			}
        },
        async asyncData ({ params }) {
            let areaSelections = [];
            let areas = await db.collection('areas')
                .where('country', '==', 'US')
                .orderBy('state')
                .orderBy('city')
                .get()
                .then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        areaSelections.push({
                            key: doc.data().city,
                            value: `${doc.data().city}, ${doc.data().state}`
                        })
                    });
                })

            return {
                areaSelections: areaSelections
            }
        },
        computed: {
            estimatedCost: function(){
                return this.request.pages + 15;
            }
        },
        mounted() {

		},
		methods: {
		    storeQuery(val) {
		        console.log(typeof val);
		        if(typeof val == 'string' && val.length>0){
                    this.query = val;
                }
            },
			updateQuery() {
				this.$axios.post('/repositories/search', {
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
                // Generate a label for the request
                this.request.label = this.request.citation.match(/^(\w(\s*))+/)[0];

				this.errors.citation = []
				this.errors.repository = []
				this.errors.label = []
				this.loading = true
				this.$axios.post('/requests', {
                    label: this.request.label,
                    pages: this.request.pages,
					repository_id: this.request.repository_id,
					citation: this.request.citation,
                    estimated_cost_usd: this.estimatedCost,
					client_id: this.$store.state.auth.user.id,
				}).then(res => {
					this.loading = false
					console.log(res)
					// this.$store.dispatch('auth/setUser').then(() => {
						this.$router.push('/')
					// })
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
    #add-stepper, h1 {
        width: 80%;
        margin: 0 auto;
    }
</style>
