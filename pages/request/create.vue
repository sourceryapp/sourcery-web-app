<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <h1 style="width:100%">
        Create Request
      </h1>

      <v-alert
        :value="true"
        type="info"
        class="mt-4 mb-4"
      >
        <!-- During the beta, users can request documents located in the Boston, New York, and Washington, D.C. metro areas, and at the University of Connecticut. -->
        Due to the pandemic, documents can only be requested from our partner institutions.
      </v-alert>

      <v-alert
        :value="!canMakePayments"
        type="warning"
        class="mt-4 mb-4"
      >
        You must add a credit card before submitting a request.
        <v-btn :to="{name: 'account-credit-cards'}">
          Add Card
        </v-btn>
      </v-alert>

      <label for="area" class="title" />

      <v-card v-if="formState===1">
        <v-card-title primary-title>
          <div>
            <div class="headline">
              Where is your document located?
            </div>
            <!-- <span class="grey--text"><nuxt-link :to="{ name: 'suggest-repository' }">Don't see yours listed?</nuxt-link></span> -->
          </div>
        </v-card-title>
        <v-card-text>
          <!-- The following is a temporary selection tool for partner organizations -->
          <v-radio-group v-model="request.repository_id">
            <v-radio
              v-for="repo in repositories"
              :key="repo.id"
              color="primary"
              :label="repo.data().name"
              :value="repo.id"
            />
          </v-radio-group>

          <!-- https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/ -->
          <!-- <ais-instant-search :search-client="searchClient" :index-name="searchIndex">
            <ais-search-box v-model="repoSearchText" placeholder="Repository Name" />
            <ais-configure
              :hitsPerPage="15"
            />
            <ais-hits>
              <v-list id="repo-search" slot-scope="{items}" two-line subheader>
                <template v-for="(item, index) in items">
                  <v-list-tile
                    :key="item.objectID"
                    avatar
                    ripple
                    :class="item.objectID === repository_id ? 'deep-purple lighten-4' : ''"
                    @click="repoSelection(item)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                      <v-list-tile-sub-title><span v-if="item.institution">{{ item.institution }}, </span>{{ item.city }}, {{ item.state }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-tooltip top>
                        <template v-if="isMemberRepo(item)" v-slot:activator="{ on }">
                          <v-icon color="primary" dark v-on="on">
                            business
                          </v-icon>
                        </template>
                        <span>Partner Institution</span>
                      </v-tooltip>
                    </v-list-tile-action>
                  </v-list-tile>

                  <v-divider :key="index" />
                </template>
              </v-list>
            </ais-hits>
          </ais-instant-search> -->
        </v-card-text>
        <v-card-actions>
          <v-layout
            justify-end
          >
            <v-btn
              id="next-repo"
              color="primary"
              :disabled="!request.repository_id"
              @click="formState=2"
            >
              Next
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>

      <v-card v-if="formState===2">
        <v-card-title primary-title>
          <div>
            <div class="headline">
              What is the citation for your document?
            </div>
            <span class="grey--text text--darken-1 body-1">Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collection, etc.).</span>
          </div>
        </v-card-title>

        <v-card-text>
          <v-textarea
            id="citation"
            v-model="citation"
            name="citation"
            label="Citation"
            multi-line="true"
            auto-grow
          />
        </v-card-text>
        <v-card-actions>
          <v-layout
            justify-space-between
          >
            <v-btn
              @click="formState=1"
            >
              Previous
            </v-btn>
            <v-btn
              id="next-citation"
              color="primary"
              :disabled="citation.length < 10"
              @click="formState=3"
            >
              Next
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>

      <v-card v-if="formState===3">
        <v-card-title primary-title>
          <div>
            <div class="headline">
              Estimated Number of Pages Needed
            </div>
            <span class="grey--text text--darken-1" />
          </div>
        </v-card-title>

        <v-card-text>
          <v-layout>
            <v-flex xs6>
              <p />
              <v-text-field
                id="pages"
                v-model="pages"
                name="pages"
                label="Maximum Pages"
                type="number"
                min="1"
              />
            </v-flex>
            <v-flex v-if="request.pricing.total" xs5 offset-xs1>
              <p class="caption mb-0 primary--text">
                Cost Will Not Exceed
              </p>
              <p id="price" class="display-1 pt-0 font-weight-bold">
                {{ toDollars(request.pricing.total) }}
              </p>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout
            justify-space-between
          >
            <v-btn
              @click="formState=2"
            >
              Previous
            </v-btn>
            <v-btn
              id="submit-request"
              :disabled="!request.pricing.total || !canMakePayments || isSaving"
              :loading="loadingCost || isSaving"
              class="primary"
              @click="submitRequest"
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
import algoliasearch from 'algoliasearch/lite'
import 'instantsearch.css/themes/algolia-min.css'

export default {
    name: 'Create',
    auth: true,
    async asyncData ({ params, store, app }) {
        let repositories = { docs: [] }
        try {
            repositories = await app.$fire.firestore
                .collection('repositories')
                .where('organization', '!=', '')
                .orderBy('organization')
                .orderBy('name', 'asc')
                .get()
        } catch (error) {
            console.log(error)
        }
        return {
            repositories: repositories.docs
        }
    },
    data () {
        return {
            repositories: [],
            repository: null,
            areas: null,
            active: null,
            loading: false,
            loadingCost: false,
            errors: {
                label: [],
                repository: [],
                citation: []
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
    computed: {
        usermeta () {
            return this.$store.state.meta
        },
        request () {
            return this.$store.state.create
        },
        ...mapGetters({
            user: 'auth/activeUser',
            isResearcher: 'meta/isResearcher',
            isSourcerer: 'meta/isSourcerer',
            balance: 'meta/balance',
            canMakePayments: 'meta/canMakePayments',
            isMemberRepo: 'create/isMemberRepo'
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
        pages: {
            get () {
                return this.$store.state.create.pages
            },
            set (value) {
                this.getCost()
                this.$store.commit('create/setPages', value)
            }
        },
        repository_id: {
            get () {
                return this.$store.state.create.repository_id
            },
            set (value) {
                this.$store.commit('create/setRepositoryId', value)
            }
        }
    },
    watch: {
        repoSearchText (newVal, oldVal) {
            /**
                 * The search text has changed, so we need to
                 * reset the repository_id
                 */
            this.repository_id = null
        }
    },
    mounted () {
    // console.log(this.request);
        console.log(this.repositories)
    },
    methods: {
        submitRequest () {
            this.isSaving = true
            this.$store.dispatch('create/insert').then((doc) => {
                this.$toast.success('Your request has been submitted!')
                this.isSaving = false
                console.log('Inserted:', doc.id)
                this.$store.commit('create/reset')
                this.$router.push({ name: 'dashboard' })
            }).catch((error) => {
                console.log(error)
                if (error) {
                    this.isSaving = false
                    this.$toast.error('There was a problem saving your request.')
                }
            })
        },

        async getCost () {
            this.loadingCost = true
            const cost = this.$fire.functions.httpsCallable('cost')
            const costObj = await cost({
                repository: this.repositoryName,
                pages: this.request.pages
            })
            this.request.pricing = costObj.data
            this.loadingCost = false
        },
        toDollars (cents) {
            return this.$utils.currencyFormat(cents)
        },
        testSelect (id) {
            console.log(id)
        },
        repoSelection (repo) {
            // console.log(repo.objectID, repo);
            this.repository_id = repo.objectID
        }
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
