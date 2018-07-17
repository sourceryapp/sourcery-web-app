<template>
	<div>
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

        <h1>Create Request</h1>

        <v-stepper id="add-stepper" v-model="e6" vertical>

            <v-stepper-step :complete="e6 > 1" step="1">
                Where is your document located?
            </v-stepper-step>
            <v-stepper-content step="1">
                <v-autocomplete
                        v-model="location"
                        :items="items"
                        label="Type to search"
                        :clearable="true"
                        type="text"
                        value="something"
                        required
                        :cache-items="true"
                        :open-on-click=false
                        @update:searchInput="storeQuery"


                >
                    <template slot="no-data">
                        <v-list>
                            <v-list-tile
                            >
                                <v-list-tile-content>
                                    <v-list-tile-title>Uh oh...</v-list-tile-title>
                                    <v-list-tile-sub-title>We don't serve this location yet.</v-list-tile-sub-title>
                                </v-list-tile-content>



                                <v-list-tile-content>
                                    <v-btn color="primary" @click.stop="dialog=true">Learn More</v-btn>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </template>
                </v-autocomplete>
                <template>
                    <div class="text-xs-center">
                        <v-dialog
                                v-model="dialog"
                                fullscreen
                        >

                            <v-card>
                                <v-card-title
                                        class="headline grey lighten-3"
                                        primary-title

                                >
                                    Service Areas
                                </v-card-title>

                                <v-card-text>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <p><strong>Would you like to submit {{ query }} for consideration?</strong></p>
                                    <v-text-field type="text" :value="query" label="Loation Suggestion"></v-text-field>
                                </v-card-text>

                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn
                                            color="primary"

                                            @click="dialog = false"
                                    >
                                        Submit
                                    </v-btn>
                                    <v-btn
                                            color="primary"

                                            @click="dialog = false"
                                    >
                                        Close
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </template>
                <v-btn color="primary" @click.native="e6 = 2">Continue</v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 2" step="2">What is the citation for your document?</v-stepper-step>
            <v-stepper-content step="2">
                <v-textarea
                        id="citation"
                        name="citation"
                        multi-line="true"
                        auto-grow
                        placeholder="Example:

Wilson, Budge. Typescript of short story Brothers and Sisters. 2000. MS-2-650.2013-070, Box 3, Folder 9. Budge Wilson fonds. Dalhousie University Archives, Halifax, Nova Scotia, Canada."
                ></v-textarea>
                <v-btn color="primary" @click.native="e6 = 3">Continue</v-btn>
                <v-btn  @click="e6--">Back</v-btn>
                <v-btn color="orange" style="float:right" left  @click.stop="citationDialog=true">Need Help?</v-btn>
                <template>
                    <div class="text-xs-center">
                        <v-dialog
                                v-model="citationDialog"
                                fullscreen
                        >

                            <v-card>
                                <v-card-title
                                        class="headline grey lighten-3"
                                        primary-title

                                >
                                    Citations
                                </v-card-title>

                                <v-card-text>
                                    <p>Best practices regarding citations...</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <ul>
                                        <li>Collection</li>
                                        <li>Call Number</li>
                                        <li>Box/Folder Number</li>
                                        <li>Microfilm Reel</li>
                                        <li>Creator</li>
                                        <li>Title</li>
                                        <li>Date</li>
                                        <li>Pages</li>
                                    </ul>
                                </v-card-text>

                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            color="primary"

                                            @click="citationDialog = false"
                                    >
                                        Close
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </template>

            </v-stepper-content>
            <v-stepper-step :complete="e6 > 3" step="3">Estimated Cost</v-stepper-step>
            <v-stepper-content step="3">
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

                <div>

                </div>
                <v-btn color="primary" @click.native="e6 = 4">Accept</v-btn>
                <v-btn  @click="e6--">Back</v-btn>
            </v-stepper-content>
            <v-stepper-step step="4">Agree to Terms</v-stepper-step>
            <v-stepper-content step="4">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id posuere urna, ac maximus quam. Nullam condimentum nec turpis vitae consectetur. Proin in erat maximus, posuere elit sit amet, dignissim odio. Aliquam egestas, urna in convallis imperdiet, massa massa mollis dui, a mollis eros nulla vitae ex. Integer viverra hendrerit dolor, ut pellentesque metus pulvinar sit amet. Proin fringilla nibh pharetra felis aliquam, nec porttitor quam dictum. Curabitur scelerisque tortor congue felis condimentum ullamcorper. Cras pellentesque gravida mattis. Praesent commodo ultrices libero et viverra. </p>
                <v-checkbox
                        name="agree"
                        label="I agree to these terms."
                        required
                ></v-checkbox>
                <v-btn color="primary" @click.native="e6 = 1">Submit</v-btn>
                <v-btn  @click="e6--">Back</v-btn>
            </v-stepper-content>
        </v-stepper>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "create",
		data() {
			return {
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
                    'Southern New Hampshire University',
                    'University of Connecticut',
                    'University of Massachusetts Amherst',
                    'Harvard University',
                    'Northeastern University',
                    'University of Rhode Island',
                    'University of New Hampshire Main Campus',
                    'Boston College',
                    'Yale University',
                    'University of Vermont',
                    'University of Massachusetts Lowell',
                    'Massachusetts Institute of Technology',
                    'University of Massachusetts Boston',
                    'Tufts University',
                    'Brown University',
                    'University of Maine',
                    'Johnson & Wales University Providence',
                    'Bridgewater State University',
                    'Quinnipiac University',
                    'Central Connecticut State University',
                    'Southern Connecticut State University',
                    'University of Massachusetts Dartmouth',
                    'Massachusetts College of Pharmacy and Health Sciences',
                    'Salem State University',
                    'Dartmouth College',
                    'Suffolk University',
                    'Sacred Heart University',
                    'Rhode Island College',
                    'University of New Haven',
                    'University of New England',
                    'Berklee College of Music',
                    'Westfield State University',
                    'Brandeis University',
                    'University of Hartford',
                    'Worcester Polytechnic Institute',
                    'Bentley University',
                    'Community College of Rhode Island',
                    'University of Southern Maine',
                    'Eastern Connecticut State University',
                    'Roger Williams University',
                    'Emerson College',
                    'Bunker Hill Community College',
                    'Fairfield University',
                    'Plymouth State University',
                    'Worcester State University',
                    'Western Connecticut State University',
                    'Keene State College',
                    'Bristol Community College',
                    'Wentworth Institute of Technology'
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