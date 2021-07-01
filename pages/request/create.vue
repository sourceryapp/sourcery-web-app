<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1>
        Create Request
      </h1>

      <!-- <v-alert
        icon="mdi-information"
        text
        type="info"
        class="mt-1 mb-0"
        dismissible
      >
        Due to the pandemic, documents can only be requested from our institutional partners.
      </v-alert> -->

      <!-- <v-alert
        :value="!canMakePayments"
        type="warning"
        class="mt-4 mb-4"
      >
        You must add a credit card before submitting a request.
        <v-btn :to="{name: 'account-credit-cards'}">
          Add Card
        </v-btn>
      </v-alert> -->
      <v-stepper
        v-model="formState"
        class="elevation-0 transparent"
      >
        <v-stepper-header
          class="elevation-0 "
        >
          <v-stepper-step
            :complete="formState > 1"
            step="1"
            class="font-weight-medium"
          >
            Location
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            :complete="formState > 2"
            step="2"
            class="font-weight-medium"
          >
            Citation
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="3"
            class="font-weight-medium"
          >
            Pages
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card
              outlined
              class="mb-4"
            >
              <v-card-title
                :class="$vuetify.theme.dark ? 'flex-nowrap justify-space-between primary--text text--lighten-2 secondary' : 'flex-nowrap justify-space-between primary--text text--darken-2 deep-purple lighten-5'"
              >
                Where is your document located?
                <v-icon
                  :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
                >
                  mdi-map-marker
                </v-icon>
              </v-card-title>
              <v-divider />
              <v-card-subtitle>
                During the pandemic, documents can only be requested from our institutional partners.
              </v-card-subtitle>
              <!-- <v-card-text>
                The following is a temporary selection tool for partner organizations
              <v-radio-group v-model="request.repository_id">
                <v-radio
                  v-for="repo in repositories"
                  :key="repo.id"
                  color="primary"
                  :label="repo.data().name"
                  :value="repo.id"
                  class="font-weight-medium"
                />
              </v-radio-group>
               https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/
              <ais-instant-search :search-client="searchClient" :index-name="searchIndex">
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
                                <v-list-tile-subtitle><span v-if="item.institution">{{ item.institution }}, </span>{{ item.city }}, {{ item.state }}</v-list-tile-subtitle>
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
                    </ais-instant-search>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  id="next-repo"
                  color="primary"
                  :disabled="!request.repository_id"
                  depressed
                  @click="formState++"
                >
                  Next
                </v-btn>
              </v-card-actions> -->
            </v-card>
            <v-item-group mandatory>
              <v-item
                v-for="repo in repositories"
                v-slot="{ toggle }"
                :key="repo.id"
              >
                <v-card
                  outlined
                  class="mb-2"
                  @click="toggle"
                >
                  <v-img
                    :src="`/img/repo/${repo.id}.jpg`"
                    class="align-stretch"
                    gradient="135deg, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.7) 100%"
                    width="100%"
                    aspect-ratio="4"
                    min-height="180px"
                  >
                    <v-container class="fill-height">
                      <v-row>
                        <v-col class="d-flex justify-end">
                          <img
                            v-if="repo.data().show_org_photo"
                            :src="`/img/institution/${repo.data().organization}.png`"
                            alt="alt"
                            height="48px"
                          >
                        </v-col>
                      </v-row>
                      <v-row class="align-self-end">
                        <v-col class="pa-0">
                          <v-list-item
                            two-line
                          >
                            <v-list-item-content>
                              <v-list-item-title class="text-h5 white--text">
                                {{ repo.data().name }}
                              </v-list-item-title>
                              <v-list-item-subtitle v-if="repo.data().name != repo.data().institution" class="text-subtitle-1 white--text">
                                {{ repo.data().institution }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="text-subtitle-2 white--text">
                                {{ repo.data().address1 + ', ' + repo.data().city + ', ' + repo.data().state }}
                              </v-list-item-subtitle>
                              <!-- <v-list-item-subtitle class="white--text">
                                {{ repo.id }}
                              </v-list-item-subtitle> -->
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                        <v-col cols="2" class="d-flex flex-row-reverse align-end">
                          <v-btn
                            color="white"
                            class="black--text"
                            @click="selectRepositoryObj(repo)"
                          >
                            Select
                          </v-btn>
                          <!-- <v-avatar
                            v-if="active"
                            class="deep-purple lighten-5 align-end"
                          >
                            <v-icon
                              class="primary--text text--darken-4"
                            >
                              mdi-check
                            </v-icon>
                          </v-avatar> -->
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-img>
                  <!-- In the future the images for the repos should be stored somewhere in Firebase so that they can be updated dynamically instead of having to push out a new build -->
                  <!-- <v-card-actions>
                    <v-avatar
                      v-show="active"
                      :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
                    >
                      <v-icon>
                        mdi-check
                      </v-icon>
                    </v-avatar>
                  </v-card-actions> -->
                </v-card>
              </v-item>
            </v-item-group>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card outlined>
              <v-card-title
                :class="$vuetify.theme.dark ? 'flex-nowrap justify-space-between primary--text text--lighten-2 secondary' : 'flex-nowrap justify-space-between primary--text text--darken-2 deep-purple lighten-5'"
              >
                What is the citation for your document?
                <v-spacer />
                <v-icon
                  :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
                >
                  mdi-format-quote-close
                </v-icon>
              </v-card-title>
              <v-divider />
              <v-card-subtitle>
                Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collection, etc.).
              </v-card-subtitle>
              <v-card-text>
                <p>Currently requesting from: {{ request.repository.name }} - {{ request.repository.institution }}</p>
                <v-textarea
                  id="citation"
                  v-model="citation"
                  name="citation"
                  label="Citation"
                  auto-grow
                  filled
                  rows="1"
                  hide-details="auto"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  @click="formState--"
                >
                  Previous
                </v-btn>
                <v-spacer />
                <v-btn
                  id="next-citation"
                  depressed
                  color="primary"
                  :disabled="citation.length < 10"
                  @click="formState++"
                >
                  Next
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card outlined>
              <v-card-title
                :class="$vuetify.theme.dark ? 'flex-nowrap justify-space-between primary--text text--lighten-2 secondary' : 'flex-nowrap justify-space-between primary--text text--darken-2 deep-purple lighten-5'"
              >
                How long is your document?
                <v-spacer />
                <v-icon
                  :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
                >
                  mdi-book-open-page-variant
                </v-icon>
              </v-card-title>
              <v-divider />
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
                      value="1"
                      min="1"
                      filled
                      inputmode="numeric"
                    />
                  </v-flex>
                  <v-flex xs5 offset-xs1>
                    <p class="text-caption mb-0 primary--text font-weight-medium">
                      Cost Will Not Exceed
                    </p>
                    <!-- <p id="price" class="text-h4 pt-0 font-weight-bold">
                      {{ toDollars(request.pricing.total) }}
                    </p> -->
                    <p id="price" class="text-h4 pt-0 font-weight-bold">
                      $0.00

                      <v-tooltip
                        bottom
                      >
                        <template #activator="{ on, attrs }">
                          <v-icon
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-information
                          </v-icon>
                        </template>
                        <span>During the development phase, Sourcery does not charge for any requests.</span>
                      </v-tooltip>
                    </p>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  @click="formState=2"
                >
                  Previous
                </v-btn>
                <v-spacer />
                <v-btn
                  id="submit-request"
                  :disabled="!request.pricing.total || isSaving"
                  :loading="loadingCost || isSaving"
                  class="primary"
                  depressed
                  @click="submitRequest"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
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
                // .where('organization', '!=', '') // This is the correct way, but for demo purposes, only show our partners.  Cannot combine != queries.
                .where('institution', 'in', ['Folger Shakespeare Library', 'UConn', 'Northeastern University', 'Hartford Public Library'])
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
        if (this.$store.state.create.repository && this.$store.state.create.repository.id) {
            this.selectRepositoryFromStateOutsideComponent(this.$store.state.create.repository)
        }
    },
    methods: {
        selectRepositoryFromStateOutsideComponent (repo) {
            this.request.repository_id = repo.id
            this.request.repository = repo
            this.$store.commit('create/setRepository', repo)
            this.formState++
        },
        selectRepositoryObj (repo) {
            this.request.repository_id = repo.id
            const repo_clone = {
                id: repo.id,
                ...repo.data()
            }
            this.request.repository = repo_clone
            this.$store.commit('create/setRepository', repo_clone)
            this.formState++
        },
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
    #repo-search {
        height: 200px;
        overflow-y: scroll;
    }

    .v-stepper__content {
      padding: 0;
    }
    .v-list-item__title {
      white-space: normal;
    }
    /* .checkmark {
        display:none;
    }
    .active .checkmark{
        display: inline-block;
    } */
</style>
