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
              <v-card-subtitle v-if="repositories.length != filteredRepositories.length" class="pa-4 mt-0">
                This list is currently filtered. Please clear your filters if you wish to show additional repositories.
              </v-card-subtitle>
            </sourcery-card>
            <v-item-group mandatory>
              <v-item
                v-for="repo in filteredRepositories"
                v-slot="{ active, toggle }"
                :key="`repolisting-${repo.id}`"
              >
                <v-card
                  outlined
                  class="mb-2"
                  @click="toggle"
                >
                  <v-img
                    :src="repo.featured_image ? repo.featured_image.url : ''"
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
                            v-if="false"
                            :src="`/img/institution/${repo.id}.png`"
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
                                {{ repo.name }}
                              </v-list-item-title>
                              <v-list-item-subtitle v-if="repo.organization && repo.name != repo.organization.name" class="text-subtitle-1 white--text">
                                {{ repo.organization.name }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="text-subtitle-2 white--text">
                                {{ repo.address1 + ', ' + repo.city + ', ' + repo.state }}
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
                  :hint="'Currently requesting from: ' + repositoryName"
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
                  :disabled="!(pricing) || isSaving"
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
import { mapGetters, mapMutations } from 'vuex'
import { Repository } from '~/models/Repository'

// Components
import RegisterToSubmitRequestDialog from '@/components/register-to-submit-request.vue'
import FinishEmailLinkRegistrationDialog from '@/components/finish-email-link-registration.vue'
import ReachedRequestLimitDialog from '@/components/reached-request-limit-dialog.vue'
import SourceryCard from '@/components/card-with-header.vue'
import { PricingSummary } from '~/models/PricingSummary'
// import CallToActionAlert from '@/components/call-to-action-alert.vue'

export default {
    name: 'Create',
    auth: true,
    components: {
        RegisterToSubmitRequestDialog,
        FinishEmailLinkRegistrationDialog,
        ReachedRequestLimitDialog,
        SourceryCard
    },
    async asyncData ({ store }) {
        let repositories = await Repository.getActive()
        if (store.getters['supabaseAuth/isAdmin']) {
            const ghosts = await Repository.getGhost()
            repositories = repositories.concat(ghosts)
        }
        return {
            repositories
        }
    },
    data () {
        return {
            repositories: [],
            loading: false,
            loadingCost: false,
            errors: {
                label: [],
                repository: [],
                citation: []
            },
            formState: 1,
            isSaving: false,
            nulledRequestPricing: true
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            repositoryName: 'supabaseCreate/repositoryName',
            hasRepository: 'supabaseCreate/hasRepository',
            pricing: 'supabaseCreate/pricing',
            integrationData: 'supabaseCreate/integrationData'
        }),
        citation: {
            get () {
                return this.$store.getters['supabaseCreate/citation']
            },
            set (value) {
                this.$store.commit('supabaseCreate/setCitation', value)
            }
        },
        pages: {
            get () {
                return this.$store.getters['supabaseCreate/pages']
            },
            set (value) {
                this.getCost()
                this.$store.commit('supabaseCreate/setPages', value)
            }
        },
        filteredRepositories () {
            if (this.integrationData && this.integrationData.organization_id) {
                const repositories = this.repositories.filter((x) => {
                    return x.organization_id && x.organization_id === this.integrationData.organization_id
                })
                return repositories
            }
            return this.repositories
        }
    },
    mounted () {
        if (this.hasRepository) {
            const repo = this.repositories.find(x => x.name === this.repositoryName)
            if (repo) {
                this.selectRepositoryObj(repo)
            }
        }

        const inProgressRequest = JSON.parse(localStorage.getItem('sourceryInProgressRequest'))

        if (inProgressRequest && inProgressRequest.request) {
            // We have an in progress request, lets restore.
            const repo = this.repositories.find(x => x.id === inProgressRequest.request.repository_id)

            if (repo) {
                this.selectRepositoryObj(repo)

                if (inProgressRequest.request.citation) {
                    this.citation = inProgressRequest.request.citation
                    this.formState++
                }

                if (inProgressRequest.request.pages) {
                    this.pages = inProgressRequest.request.pages
                }

                localStorage.removeItem('sourceryInProgressRequest')
            } else {
                localStorage.removeItem('sourceryInProgressRequest')
            }
        }
    },
    methods: {
        ...mapMutations({
            setRepository: 'supabaseCreate/setRepository',
            setPricing: 'supabaseCreate/setPricing'
        }),
        selectRepositoryObj (repo) {
            this.setRepository(repo)
            this.formState++
        },
        submitRequest () {
            // else if (!this.user.hasPassword && this.user.hasRequests) {
            //     // no password, so we need to limit the request to 1.
            //     this.$refs.reached_request_limit_dialog.openDialog()
            // }
            if (!this.user) {
                // Right now we are nulling prices, in beta.  But this is ready for when we need to add pricing models back in.
                if (!this.nulledRequestPricing && this.request.pricing.total > 0) {
                    this.$refs.register_to_submit_request_dialog.openDialog()
                } else {
                    this.$refs.register_to_submit_request_dialog.openWithRegisterIntent()
                }
            } else {
                this.isSaving = true
                this.$store.dispatch('supabaseCreate/insert').then((doc) => {
                    this.isSaving = false
                    if (doc) {
                        this.$toast.success('Your request has been submitted!')
                        console.log('Inserted:', doc.id)
                    }
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

        getCost () {
            this.loadingCost = true
            // const cost = this.$fire.functions.httpsCallable('cost')
            // const costObj = await cost({
            //     repository: this.repositoryName,
            //     pages: this.pages
            // })
            // this.request.pricing = costObj.data

            // Currently nulled.
            this.setPricing(PricingSummary.createNull())
            this.loadingCost = false
        },
        toDollars (cents) {
            return this.$utils.currencyFormat(cents)
        }
    }
}
</script>

<style scoped>
    .v-stepper__content {
      padding: 0;
    }
    .v-list-item__title {
      white-space: normal;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>
