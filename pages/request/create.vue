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

                <v-alert
                    :value="!canMakePayments"
                    type="warning"
                    class="mt-4 mb-4"
                    >
                    You must add a credit card before submitting a request.
                    <v-btn :to="{name: 'account-credit-cards'}">Add Card</v-btn>
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
                                    <v-list-tile-sub-title v-html="data.item.institution"></v-list-tile-sub-title>
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
                            :disabled="request.citation.length < 10"
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
                            :disabled="!request.pricing.total || !canMakePayments"
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
import { mapGetters } from 'vuex'
import { db, functions } from '~/plugins/firebase-client-init.js'
import { Utils } from '~/modules/utilities'

	export default {
        name: "create",
        auth: true,
		data() {
			return {
                areas: null,
                repositories: ["Loading..."],
                repositoryName: null,
                request: {
                    pages: 0,
                    citation: ''
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
            let areas = new Map();
            await db.collection('areas')
                .where('country', '==', 'US')
                .orderBy('state')
                .orderBy('city')
                .get()
                .then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        areaSelections.push({
                            key: doc.id,
                            value: `${doc.data().city}, ${doc.data().state}`
                        })
                        areas.set(doc.id, doc.data())
                    });
                })

            return {
                areaSelections: areaSelections,
                areas: areas,

                // Set a random citation during development.
                // @todo Remove random citations before launch.
                request: {
                    pages: 0,
                    citation: '', //citations[Math.floor(Math.random()*citations.length)],
                    pricing: {
                        total: 0
                    }
                }
            }
        },
        computed: {
            usermeta: function(){
                return this.$store.state.meta
            },
            ...mapGetters({
                user: 'auth/activeUser',
                isResearcher: 'meta/isResearcher',
                isSourcerer: 'meta/isSourcerer',
                balance: 'meta/balance',
                canMakePayments: 'meta/canMakePayments'
            }),
        },
        mounted() {
        },
        watch: {
            /**
             * Update repositories after the Area field changes
             */
            area: async function (newArea, oldArea) {
                let area = this.areas.get(newArea);
                this.loadingLocations = true;
                let repositoriesList = [];
                let repQuery = await db.collection('repositories')
                    .where('state', '==', area.state)     // Matches state
                    .orderBy('institution')
                    .orderBy('name')
                    .get()
                    .then((snapshot) => {
                        snapshot.docs.forEach(doc => {
                            // Check if the result matches the chosen city or nearby cities
                            if(doc.data().city == area.city || area.includes.indexOf(doc.data().city)){
                                repositoriesList.push({
                                    id: doc.id,
                                    name: doc.data().name,
                                    institution: doc.data().institution
                                })
                            }
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
                    totalPages: 0,
                    repository_id: this.request.repository_id,
                    repository: await this.getRepository( this.request.repository_id ),
					citation: this.request.citation,
                    client_id: this.$store.getters['auth/activeUser'].uid,
                    status: "pending",
                    created_at: new Date(),
                    vendor_id: "",
                    attachments: [],
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
