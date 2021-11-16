<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <v-alert
        v-if="!user"
        icon="mdi-information"
        text
        type="info"
        class="mt-3 mb-0"
        dismissible
      >
        You will need to register before completely submitting a request.
      </v-alert>

      <reached-request-limit-dialog
        ref="reached_request_limit_dialog"
      />

      <!-- <call-to-action-alert
        v-if="user && !user.hasPassword"
        message="In order to gain access to the full features of Sourcery, you must set a password."
        to="/settings"
        type="warning"
        action-text="Set Password."
      /> -->

      <register-to-submit-request-dialog
        ref="register_to_submit_request_dialog"
      />

      <finish-email-link-registration-dialog
        ref="finish_email_link_registration_dialog"
      />

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
          class="elevation-0 my-4"
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
            <sourcery-card title="Where is your document located?">
              <v-card-subtitle class="pa-4 mt-0">
                During the pandemic, documents can only be requested from our institutional partners.
              </v-card-subtitle>
            </sourcery-card>
            <v-item-group mandatory>
              <v-item
                v-for="repo in repositories"
                v-slot="{ active, toggle }"
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
                    :gradient="active && $vuetify.breakpoint.xs ? '135deg, rgba(48, 32, 111,0.4) 20%, rgba(48, 32, 111,0.7) 100%' : '135deg, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.7) 100%'"
                    width="100%"
                    aspect-ratio="4"
                    min-height="240px"
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
                            v-if="$vuetify.breakpoint.smAndUp"
                            color="white"
                            class="black--text"
                            @click="selectRepositoryObj(repo)"
                          >
                            Select
                          </v-btn>
                          <v-fab-transition>
                            <v-btn
                              v-if="active && $vuetify.breakpoint.xs"
                              color="white"
                              fab
                              small
                              @click="selectRepositoryObj(repo)"
                            >
                              <v-icon>
                                mdi-arrow-right
                              </v-icon>
                            </v-btn>
                          </v-fab-transition>
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
            <sourcery-card title="What is the citation for your document?">
              <v-card-subtitle class="pt-4 pl-6 mt-0 pr-4">
                Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collection, etc.).
              </v-card-subtitle>
              <v-card-text>
                <v-textarea
                  id="citation"
                  v-model="citation"
                  name="citation"
                  label="Citation"
                  auto-grow
                  outlined
                  rows="3"
                  :hint="'Currently requesting from: ' + repository_name"
                  persistent-hint
                  class="my-2"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  @click="
                    formState--"
                >
                  Previous
                </v-btn>
                <v-spacer />
                <v-btn
                  id="next-citation"
                  depressed
                  color="primary"
                  :disabled="citation.length < 4"
                  @click="formState++"
                >
                  Next
                </v-btn>
              </v-card-actions>
            </sourcery-card>
          </v-stepper-content>
          <v-stepper-content step="3">
            <sourcery-card title="How long is your document?">
              <v-card-text class="pa-4 mt-0">
                <v-container>
                  <v-row class="align-center">
                    <v-col class="col-4 offset-1">
                      <v-text-field
                        id="pages"
                        v-model="pages"
                        name="pages"
                        label="Maximum Pages"
                        type="text"
                        value="1"
                        min="1"
                        outlined
                        suffix="pages"
                        hide-details="auto"
                        inputmode="numeric"
                        class="text-body-1"
                      />
                    </v-col>
                    <v-col>
                      <v-flex class="justify-center">
                        <p class="text-caption mb-0 primary--text font-weight-medium text-center">
                          Cost Will Not Exceed
                        </p>
                        <!-- <p id="price" class="text-h4 pt-0 font-weight-bold">
                      {{ toDollars(request.pricing.total) }}
                    </p> -->
                        <p id="price" class="text-h4 pt-0 font-weight-bold text-center">
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
                                mdi-information-outline
                              </v-icon>
                            </template>
                            <span>During the development phase, Sourcery does not charge for any requests.</span>
                          </v-tooltip>
                        </p>
                      </v-flex>
                    </v-col>
                  </v-row>
                </v-container>
                <v-flex class="flex-row justify-center" />
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
            </sourcery-card>
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

// Components
import RegisterToSubmitRequestDialog from '@/components/register-to-submit-request.vue'
import FinishEmailLinkRegistrationDialog from '@/components/finish-email-link-registration.vue'
import ReachedRequestLimitDialog from '@/components/reached-request-limit-dialog.vue'
import SourceryCard from '@/components/card-with-header.vue'
// import CallToActionAlert from '@/components/call-to-action-alert.vue'

export default {
    name: 'Create',
    auth: true,
    components: {
        RegisterToSubmitRequestDialog,
        FinishEmailLinkRegistrationDialog,
        ReachedRequestLimitDialog,
        'sourcery-card': SourceryCard
    },
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
            newUserEmailAddress: '',
            nulledRequestPricing: true,

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
        },
        repository_name () {
            if (this.request.repository.name === this.request.repository.institution) {
                return this.request.repository.name
            }
            return `${this.request.repository.name} - ${this.request.repository.institution}`
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
        if (this.$fire.auth.isSignInWithEmailLink(window.location.href)) {
            console.log('This is a sign in with email link!')
            const saved_info = JSON.parse(localStorage.getItem('sourceryEmailSignInWith'))
            console.log(saved_info)
            if (saved_info) {
                if (saved_info.request && saved_info.request.repository_id) {
                    const repo = this.repositories.find(e => e.id === saved_info.request.repository_id)
                    if (!repo) {
                        return false
                    }
                    this.selectRepositoryObj(repo)
                    this.citation = saved_info.request.citation
                    this.pages = saved_info.request.pages
                    this.formState = 3
                }
                if (saved_info.email) {
                    const intent = saved_info.loginIntent ? 'login' : ''
                    this.$refs.finish_email_link_registration_dialog.openDialog(intent)
                }
            }
        }
        // Handle request coming from archiveSpace, otherwise ensure no data is left over.
        if (this.$store.state.archive.archiveOrigin) {
            console.log('Recieving from archive space')
            this.processArchiveSpace()
        } else {
            this.$store.commit('create/cleanArchive')
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
            if (!this.user) {
                // Right now we are nulling prices, in beta.  But this is ready for when we need to add pricing models back in.
                if (!this.nulledRequestPricing && this.request.pricing.total > 0) {
                    this.$refs.register_to_submit_request_dialog.openDialog()
                } else {
                    this.$refs.register_to_submit_request_dialog.openWithRegisterIntent()
                }
            } else if (!this.user.hasPassword && this.user.hasRequests) {
                // no password, so we need to limit the request to 1.
                this.$refs.reached_request_limit_dialog.openDialog()
            } else {
                this.isSaving = true
                this.$store.dispatch('create/insert').then((doc) => {
                    this.$toast.success('Your request has been submitted!')
                    this.isSaving = false
                    console.log('Inserted:', doc.id)
                    this.$store.commit('create/reset')
                    this.$store.commit('auth/SET_AUTH_USER_HAS_REQUESTS')
                    this.$router.push({ name: 'dashboard' })
                }).catch((error) => {
                    console.log(error)
                    if (error) {
                        this.isSaving = false
                        this.$toast.error('There was a problem saving your request.')
                    }
                })
            }
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
        },
        processArchiveSpace () {
            const archiveSpaceInfo = this.$store.state.archive.archiveInfo
            // set archivespace info
            this.$store.commit('create/setArchiveOrigin')
            this.$store.commit('create/setArchiveOrg', archiveSpaceInfo.organization_id)
            // set repo
            console.log('Processing archive space, these are repositories on load:', this.repositories)
            for (const repo in this.repositories) {
                if (this.repositories[repo].data().name === archiveSpaceInfo.record_repo) {
                    this.selectRepositoryObj(this.repositories[repo])
                    // this.$store.commit('create/setRepositoryId', this.repositories[repo].id)
                }
            }
            // set citation
            this.$store.commit('create/setCitation', archiveSpaceInfo.record_cite)
            // update formState
            this.formState = 2
            // reset all instances of archivespace from the store (does not remove info from create, handled above)
            this.$store.commit('archive/reset')
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
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>
