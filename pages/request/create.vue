<template>
        <v-layout row>







            <v-flex xs12 sm8 offset-sm2>



                <h1 style="width:100%">Create Request</h1>

                <v-alert
                    :value="true"
                    type="info"
                    class="mt-4 mb-4"
                    >
                    During the beta, users can request documents located in the Boston and New York metro areas, and at the University of Connecticut.
                </v-alert>

                <label for="area" class="title">

                </label>

                <v-card v-if="formState===1">

                    <v-card-title primary-title>
                    <div>
                        <div class="headline">Where is your document located?</div>
                        <!-- <span class="grey--text">1,000 miles of wonder</span> -->
                    </div>
                    </v-card-title>

                    <v-card-text>
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
                        :loading="loadingLocations"
                        >
                            <template slot="item" slot-scope="data" >
                                <v-list-tile-content>
                                    <v-list-tile-title @click="setName(data.item.name)" v-html="data.item.name"></v-list-tile-title>
                                </v-list-tile-content>
                            </template>
                        </v-select>

                    </v-card-text>
                    <v-card-actions>
                        <v-layout
                            justify-end

                        >
                            <v-btn
                            color="primary"
                            @click="formState=2"
                            :disabled="!request.repository_id"
                            >Next</v-btn>


                        </v-layout>
                    </v-card-actions>

                </v-card>

                <v-card v-if="formState===2">

                    <v-card-title primary-title>
                    <div>
                        <div class="headline">What is the citation for your document?</div>
                        <span class="grey--text text--darken-1 body-1">Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collection, etc.).</span>
                    </div>
                    </v-card-title>

                    <v-card-text>
                        <v-textarea
                            id="citation"
                            name="citation"
                            label="Citation"
                            multi-line="true"
                            v-model="request.citation"
                            auto-grow
                        ></v-textarea>

                    </v-card-text>
                    <v-card-actions>
                        <v-layout
                            justify-space-between

                        >

                            <v-btn
                            @click="formState=1"
                            >Previous</v-btn>
                            <v-btn
                            color="primary"
                            @click="formState=3"
                            >Next</v-btn>


                        </v-layout>
                    </v-card-actions>

                </v-card>



                <v-card v-if="formState===3">

                    <v-card-title primary-title>
                    <div>
                        <div class="headline">Estimated Number of Pages</div>
                        <span class="grey--text text--darken-1">You will be charged immediately for the base rate, and charged once it is picked up for the rest.</span>
                    </div>
                    </v-card-title>

                    <v-card-text>

                        <v-layout>
                            <v-flex xs6 >
                                <p></p>
                                <v-select
                                    id="pages"
                                    name="pages"
                                    v-model="request.pages"
                                    :items="pages"
                                    label="Maximum Pages"
                                    @change="getCost"
                                ></v-select>
                            </v-flex>
                            <v-flex xs5 offset-xs1 v-if="request.pricing.total">
                                <p class="caption mb-0 primary--text">Cost Will Not Exceed</p>
                                <p class="display-1 pt-0 font-weight-bold">{{ toDollars(request.pricing.total) }}</p>
                            </v-flex>
                        </v-layout>

                    </v-card-text>
                    <v-card-actions>
                        <v-layout
                            justify-space-between

                        >

                            <v-btn
                            @click="formState=2"
                            >Previous</v-btn>
                            <v-btn
                            :disabled="loadingCost"
                            :loading="loadingCost"
                            @click="submitRequest"
                            class="primary"
                            >
                            Submit
                            </v-btn>
                        </v-layout>
                    </v-card-actions>

                </v-card>

            </v-flex>

        </v-layout>





</template>

<script>

import { db, functions } from '~/plugins/firebase-client-init.js'
import { Utils } from '~/modules/utilities'

	export default {
        name: "create",
        auth: true,
		data() {
			return {
                repositories: ["Loading..."],
                repositoryName: null,
                request: {
                    pages: 0,
                    citation: 'Wysocki, Anne Frances, et al. Writing New Media: Theory and Applications for Expanding the Teaching of Composition. Utah State UP, 2004.'
                },
			    active: null,
				suggestions: [],
                loading: false,
                loadingCost: false,
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
                    35,
                    40,
                    45,
                    50
                ],
                formState: 1,
                area: null,
                loadingLocations: true
			}
        },
        async asyncData ({ params, store }) {
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

                let citations = [
                    'James P. Quentin to Sally Quentin, 12 Jan. 1876, Springfield Collection.',
                    'Manuscript Miscellany, Scribe: anon., various hands, 287 pp., paper, c. 1640.',
                    'Mass. General Statutes, 1842-7, Vol. 23, pp 18-29.',
                    'L.V. Beethoven, 5th Symphony, autograph MS, 1808.',
                    'P.D.Q. Hoagland Collection, Administrative records, clippings, correspondence, ephemera, 1963-1964, 1967-1969, 42pp.',
                ]

            return {
                areaSelections: areaSelections,

                // Set a random citation during development.
                // @todo Remove random citations before launch.
                request: {
                    pages: 0,
                    citation: null, //citations[Math.floor(Math.random()*citations.length)],
                    pricing: {
                        total: 0
                    }
                }
            }
        },
        computed: {
            usermeta: function(){
                return this.$store.state.meta
            }
        },
        mounted() {

        },
        watch: {
            /**
             * Update repositories after the Area field changes
             */
            area: async function (newArea, oldArea) {
                this.loadingLocations = true;
                let repositoriesList = [];
                let repQuery = await db.collection('repositories')
                    .where('city', '==', newArea)
                    .orderBy('name')
                    .get()
                    .then((snapshot) => {
                        snapshot.docs.forEach(doc => {
                            repositoriesList.push({
                                id: doc.id,
                                name: `${doc.data().name}, ${doc.data().institution}`
                            })
                        });
                    })
                this.loadingLocations = false;
                this.repositories = repositoriesList;
            }
        },
		methods: {
			async submitRequest() {
                // Generate a label for the request
                this.request.label = this.request.citation.match(/^(\w(\s*))+/)[0];

				this.errors.citation = []
				this.errors.repository = []
				this.errors.label = []
                this.loading = true
                this.loadingCost = true;

                let router = this.$router;

                // @todo Request should be moved to Vuex and managed thru the store
                await db.collection("requests").add({
                    label: this.request.label,
                    pages: this.request.pages,
                    repository_id: this.request.repository_id,
                    repository: await this.getRepository( this.request.repository_id ),
					citation: this.request.citation,
                    client_id: this.$store.getters['auth/activeUser'].uid,
                    status: "pending",
                    created_at: new Date(),
                    vendor_id: "",
                    attachments: {},
                    pricing: this.request.pricing
                })
                .then( async (ref) => {
                    console.log(`Imported "${ref.id}"`);

                    // Success
                    this.$toast.show('Your request was sent.', {
                        onComplete: () => {
                            router.push('/dashboard')
                        }
                    })
                })
                .catch(function(error){
                    console.error(error);
                })
            },
            async getRepository(id){
                return await db.collection('repositories')
                    .doc(id)
                    .get()
                    .then((doc) => {
                        return doc.data();
                    })
            },
            async getCost(){
                this.loadingCost = true;
                var cost = functions.httpsCallable('cost');
                var costObj = await cost({
                    repository: this.repositoryName,
                    pages: this.request.pages
                });
                this.request.pricing = costObj.data;
                this.loadingCost = false;
            },
            setName(name){
                this.repositoryName = name;
            },
            toDollars(cents){
                return Utils.currencyFormat(cents)
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
