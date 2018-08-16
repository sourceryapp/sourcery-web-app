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
                <v-tabs
                        v-model="active"
                        :left="true"
                        :grow="true"
                        dark
                        slider-color="primary"
                        show-arrows
                >
                    <v-tab ripple >
                        <v-badge left bottom>
                            <span slot="badge">1</span>
                        </v-badge>
                        &nbsp; Location
                    </v-tab>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-title>Where is your document located?</v-card-title>
                            <v-card-text>
                                <v-text-field
                                        label="Search for locations"
                                        type="search"
                                        append-icon="search"
                                        placeholder="Boston"
                                ></v-text-field>

                                <v-radio-group column >
                                    <v-layout row wrap class="light--text">
                                        <v-flex xs6 v-for="item in items" :key="item">
                                            <v-radio :label="item" :value="item"></v-radio>
                                        </v-flex>
                                    </v-layout>
                                </v-radio-group>
                            </v-card-text>
                            <v-btn color="primary" @click="next">Continue</v-btn>

                        </v-card>
                    </v-tab-item>
                    <v-tab ripple >
                        <v-badge left bottom>
                            <span slot="badge">2</span>
                        </v-badge>
                        &nbsp; Citation
                    </v-tab>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-title style="width:100%">What is the citation for your document?</v-card-title>
                            <v-card-text>
                                <v-textarea
                                        id="citation"
                                        name="citation"
                                        multi-line="true"
                                        auto-grow
                                        placeholder="Example:

Wilson, Budge. Typescript of short story Brothers and Sisters. 2000. MS-2-650.2013-070, Box 3, Folder 9. Budge Wilson fonds. Dalhousie University Archives, Halifax, Nova Scotia, Canada."
                                ></v-textarea>
                            </v-card-text>
                            <v-btn color="primary" @click="next">Continue</v-btn>

                        </v-card>
                    </v-tab-item>
                    <v-tab ripple >
                        <v-badge left bottom>
                            <span slot="badge">3</span>
                        </v-badge>
                        &nbsp; Cost
                    </v-tab>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-title>Estimate your cost:</v-card-title>

                            <v-card-text>
                                <p class="caption">
                                    The cost of your request is partially determined by the number of pages that are delivered to you.
                                    Please indicate the maximum number of pages that you would be willing to pay for.
                                </p>

                                <v-layout>
                                    <v-flex xs6 >
                                        <!--<p>You will be charged immediately for the base rate, and charged once it is picked up for the rest.</p>-->
                                        <v-select
                                                v-model="numPages"
                                                :items="pages"
                                                label="Maximum Pages"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs5 offset-xs1>
                                        <p class="caption mb-0 primary--text">Cost Will Not Exceed</p>
                                        <h1 class="pt0">$ {{ numPages + 15 }}</h1>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>

                            <v-btn color="primary" @click="next">Continue</v-btn>

                        </v-card>
                    </v-tab-item>
                    <v-tab ripple >
                        <v-badge left bottom>
                            <span slot="badge">4</span>
                        </v-badge>
                        &nbsp; Terms
                    </v-tab>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-title>Agree to terms:</v-card-title>
                            <v-card-text>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id posuere urna, ac maximus quam. Nullam condimentum nec turpis vitae consectetur. Proin in erat maximus, posuere elit sit amet, dignissim odio. Aliquam egestas, urna in convallis imperdiet, massa massa mollis dui, a mollis eros nulla vitae ex. Integer viverra hendrerit dolor, ut pellentesque metus pulvinar sit amet. Proin fringilla nibh pharetra felis aliquam, nec porttitor quam dictum. Curabitur scelerisque tortor congue felis condimentum ullamcorper. Cras pellentesque gravida mattis. Praesent commodo ultrices libero et viverra. </p>
                                <v-checkbox
                                        name="agree"
                                        label="I agree to these terms."
                                        required
                                ></v-checkbox>
                            </v-card-text>
                            <v-btn color="primary" @click="next">Continue</v-btn>

                        </v-card>
                    </v-tab-item>
                </v-tabs>


            </v-flex>

        </v-layout>





</template>

<script>
	import axios from 'axios'

	export default {
		name: "create",
		data() {
			return {
			    active: null,
			    query: "",
			    dialog: false,
                citationDialog: false,
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
                e6: 1,
                e1: null,
                location: "",
                locationCache: null,
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
                items: [
                    'Boston University',
                    'Northeastern University',
                    'Boston College',
                    'University of Massachusetts Lowell',
                    'Massachusetts Institute of Technology',
                    'University of Massachusetts Boston',
                    'Tufts University',
                ]

			}
		},
		methods: {
		    storeQuery(val) {
		        console.log(typeof val);
		        if(typeof val == 'string' && val.length>0){
                    this.query = val;
                }
            },
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
			},
            next () {
                const active = parseInt(this.active)
                this.active = (active < 3 ? active + 1 : 0)
            },
            previous(){
                const active = parseInt(this.active)
                this.active = this.active - 1

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