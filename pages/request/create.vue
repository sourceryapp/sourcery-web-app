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
                        <div class="headline">Where is your document located? </div>
                        <span class="grey--text"><nuxt-link :to="{ name: 'suggest-repository' }">Don't see yours listed?</nuxt-link></span>
                    </div>
                    </v-card-title>
                    <v-card-text>
                        <!-- https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/ -->
                        <ais-instant-search :search-client="searchClient" :index-name="searchIndex">
                                <ais-search-box placeholder="Repository Name" v-model="repoSearchText" />
                                <ais-configure
                                :hitsPerPage="15"
                                />
                                <ais-hits>
                                    <v-list two-line subheader slot-scope="{items}" id="repo-search">
                                        <template  v-for="(item, index) in items">
                                            <v-list-tile
                                                :key="item.objectID"
                                                avatar
                                                ripple
                                                @click="repoSelection(item)"
                                                :class="item.objectID === repository_id ? 'deep-purple lighten-4' : ''"
                                            >

                                                <v-list-tile-content>
                                                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                                    <v-list-tile-sub-title><span v-if="item.institution">{{item.institution}}, </span>{{ item.city }}, {{ item.state }}</v-list-tile-sub-title>
                                                </v-list-tile-content>

                                                <v-list-tile-action>
                                                    <v-tooltip top>
                                                        <template v-slot:activator="{ on }" v-if="isMemberRepo(item)">
                                                            <v-icon color="primary" dark v-on="on">business</v-icon>
                                                        </template>
                                                        <span>Partner Institution</span>
                                                    </v-tooltip>

                                                </v-list-tile-action>
                                            </v-list-tile>

                                            <v-divider :key="index"></v-divider>
                                        </template>
                                    </v-list>
                                </ais-hits>
                        </ais-instant-search>

                    </v-card-text>
                    <v-card-actions>
                        <v-layout
                            justify-end

                        >
                            <v-btn
                            id="next-repo"
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
                            v-model="citation"
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
                            id="next-citation"
                            color="primary"
                            :disabled="citation.length < 10"
                            @click="formState=3"
                            >Next</v-btn>


                        </v-layout>
                    </v-card-actions>

                </v-card>



                <v-card v-if="formState===3">

                    <v-card-title primary-title>
                    <div>
                        <div class="headline">Estimated Number of Pages Needed</div>
                        <span class="grey--text text--darken-1"></span>
                    </div>
                    </v-card-title>

                    <v-card-text>

                        <v-layout>
                            <v-flex xs6 >
                                <p></p>
                                <v-text-field
                                    id="pages"
                                    name="pages"
                                    v-model="pages"
                                    label="Maximum Pages"
                                    type="number"
                                    min="1"
                                ></v-text-field>

                            </v-flex>
                            <v-flex xs5 offset-xs1 v-if="request.pricing.total">
                                <p class="caption mb-0 primary--text">Cost Will Not Exceed</p>
                                <p class="display-1 pt-0 font-weight-bold" id="price">{{ toDollars(request.pricing.total) }}</p>
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
                            id="submit-request"
                            :disabled="!request.pricing.total || !canMakePayments || isSaving"
                            :loading="loadingCost || isSaving"
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
import { mapGetters, mapActions } from 'vuex'
import { db, functions } from '~/plugins/firebase-client-init.js'
import { Utils } from '~/modules/utilities'
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/algolia-min.css';

	export default {
        name: "create",
        auth: true,
		data() {
			return {
                areas: null,
			    active: null,
                loading: false,
                loadingCost: false,
				errors: {
					label: [],
					repository: [],
					citation: [],
				},
                formState: 1,
                isSaving: false,

                // Algolia
                searchClient: algoliasearch(
                    process.env.ALGOLIA.appId,
                    process.env.ALGOLIA.apiKey
                ),
                searchIndex: process.env.ALGOLIA.indexName,
                repoSearchText: ''
			}
        },
        async asyncData ({ params, store }) {},
        computed: {
            usermeta: function(){
                return this.$store.state.meta
            },
            request: function() {
                return this.$store.state.create;
            },
            ...mapGetters({
                user: 'auth/activeUser',
                isResearcher: 'meta/isResearcher',
                isSourcerer: 'meta/isSourcerer',
                balance: 'meta/balance',
                canMakePayments: 'meta/canMakePayments',
                isMemberRepo: 'create/isMemberRepo',
            }),

            /**
             * Mapping items to the Vuex Store
             * @url https://vuex.vuejs.org/guide/forms.html#two-way-computed-property
             */
            citation: {
                get () {
                    return this.$store.state.create.citation
                },
                set (value) {
                    this.$store.commit('create/setCitation', value)
                }
            },
            pages:{
                get () {
                    return this.$store.state.create.pages
                },
                set (value) {
                    this.getCost();
                    this.$store.commit('create/setPages', value)
                }
            },
            repository_id:{
                get () {
                    return this.$store.state.create.repository_id
                },
                set (value) {
                    this.$store.commit('create/setRepositoryId', value)
                }
            },
        },
        watch: {
            repoSearchText: function(newVal, oldVal){
                /**
                 * The search text has changed, so we need to
                 * reset the repository_id
                 */
                this.repository_id = null;
            }
        },
		methods: {
			async submitRequest() {
                this.isSaving = true;
                this.$store.dispatch('create/insert').then(snapshot => {
                    this.$toast.success('Your request has been submitted!')
                    this.isSaving = false;
                    this.$router.push({ name: 'dashboard' })
                }).catch(error => {
                    this.isSaving = false;
                    this.$toast.error('There was a problem saving your request.')
                });
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
            toDollars(cents){
                return Utils.currencyFormat(cents)
            },
            testSelect(id){
                console.log(id);
            },
            repoSelection(repo){
                // console.log(repo.objectID, repo);
                this.repository_id = repo.objectID;
            },

        },
        mounted() {
            // console.log(this.request);
        }
	}
</script>

<style scoped>
    #add-stepper, h1 {
        width: 80%;
        margin: 0 auto;
    }

    #repo-search {
        height: 200px;
        overflow-y: scroll;
    }

    /* .checkmark {
        display:none;
    }
    .active .checkmark{
        display: inline-block;
    } */
</style>
