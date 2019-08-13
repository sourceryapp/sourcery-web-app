<template>
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
                :loading="loadingLocations"
                ></v-select>


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
import { Utils } from '~/modules/utilities'

	export default {
        name: "create",
        auth: true,
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
                    citation: citations[Math.floor(Math.random()*citations.length)]
                }
            }
        },
        computed: {
            estimatedCost: function(){
                return this.request.pages + 15;
            },
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

                let router = this.$router;

                await db.collection("requests").add({
                    label: this.request.label,
                    pages: this.request.pages,
                    repository_id: this.request.repository_id,
                    repository: await this.getRepository( this.request.repository_id ),
					citation: this.request.citation,
                    estimated_cost_usd: this.estimatedCost,
                    client_id: this.$store.getters['auth/activeUser'].uid,
                    status: "pending",
                    created_at: new Date(),
                    vendor_id: "",
                    attachments: {},
                })
                .then( async (ref) => {
                    console.log(`Imported "${ref.id}"`);

                    // Success
                    this.$toast.show('Your request was sent.', {
                        onComplete: () => {
                            router.push('/')
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
