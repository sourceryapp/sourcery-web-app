<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <v-card
        v-if="!user"
        outlined
      >
        <v-card-title>You are Logged Out</v-card-title>
        <v-card-text>
          <span>Please log in to access the full set of features in Sourcery.</span>
        </v-card-text>
      </v-card>

      <sourcery-card v-if="user" title="Your Requests" icon="mdi-file-search" class="mt-16">
        <none-found-card v-if="requests.length == 0" text="No Active Requests." to="/request/create">
          Create<span class="hidden-sm-and-down">&nbsp;Request</span>
          <v-icon right :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
            mdi-open-in-new
          </v-icon>
        </none-found-card>
        <template v-for="(request) in requests">
          <v-hover
            v-slot="{ hover }"
            :key="request.id"
          >
            <v-card
              v-if="requests && !request.request().isArchived()"
              :to="'/request/' + request.id"
              class="my-4 rounded-lg"
              outlined
            >
              <v-container>
                <v-row>
                  <v-col class="pa-0">
                    <v-card-title>
                      {{ request.data().label }}
                    </v-card-title>
                    <v-card-subtitle>
                      {{ request.data().citation }}
                      <br>
                      {{ request.data().repository.name }}
                      <!-- {{ request.data().repository.name + ' - ' + request.data().repository.city + ', ' + request.data().repository.state }} -->
                    </v-card-subtitle>
                    <v-fade-transition>
                      <v-overlay
                        v-if="hover"
                        absolute
                        color="primary"
                        opacity="0.1"
                        class="rounded-lg"
                        z-index="1"
                      />
                    </v-fade-transition>
                  </v-col>
                  <v-col
                    cols="auto"
                    class="d-flex align-center justify-center rounded-r-lg px-4"
                    z-index="2"
                    :style="
                      'background: var(--sourcery-' + (request.request().prettyStatus() == 'Complete' ? '700' : '500') + ')'"
                  >
                    <p
                      class="font-weight-bold text-button ma-0"
                      :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
                    >
                      {{ request.request().prettyStatus() }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-hover>
        </template>
      </sourcery-card>
      <sourcery-card v-if="user && isOrgMember" title="Your Jobs" icon="mdi-briefcase">
        <none-found-card v-if="jobs.length == 0" text="No Active Jobs." />

        <template v-for="job in jobs">
          <v-hover
            v-slot="{ hover }"
            :key="`j` + job.id"
          >
            <v-card
              v-if="job && !job.request().isArchived()"
              :to="'/jobs/' + job.id"
              class="my-4 rounded-lg"
              outlined
            >
              <v-container>
                <v-row>
                  <v-col class="pa-0">
                    <v-card-title>
                      {{ job.data().label }}
                    </v-card-title>
                    <v-card-subtitle>
                      {{ job.data().citation }}
                      <br>
                      {{ job.data().repository.name }}
                    </v-card-subtitle>
                    <v-fade-transition>
                      <v-overlay
                        v-if="hover"
                        absolute
                        color="primary"
                        opacity="0.1"
                        class="rounded-lg"
                        z-index="1"
                      />
                    </v-fade-transition>
                  </v-col>
                  <v-col
                    cols="auto"
                    class="d-flex align-center justify-center rounded-r-lg px-4"
                    z-index="2"
                    :style="
                      'background: var(--sourcery-' + (job.request().prettyStatus() == 'Complete' ? '700' : '500') + ')'"
                  >
                    <p
                      class="font-weight-bold text-button ma-0"
                      :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
                    >
                      {{ job.request().prettyStatus() }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-hover>
        </template>
      </sourcery-card>

      <div v-if="user" class="text-center mt-8">
        <v-btn color="grey darken-1" to="/request/history" text>
          <v-icon left>
            mdi-history
          </v-icon>
          View History
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import NoneFoundCard from '@/components/none-found-card.vue'
import SourceryCard from '~/components/card-with-header.vue'

// TODO Not sure why addToHomeScreen is here
// addToHomescreen()
export default {
    // middleware: 'auth-guard',

    name: 'Dashboard',
    components: {
        'sourcery-card': SourceryCard,
        'none-found-card': NoneFoundCard
    },
    async asyncData ({ params, store, app }) {
        if (store.getters['auth/activeUser'] && store.getters['auth/activeUser'].uid) {
            const organizations = null
            // const reserve_queries = [];
            const reserved_requests = null
            // Temporarily disabled. Org requests are going straight to org owners
            // if (store.getters['meta/isOrgMember']) {
            //     // Get the organizations for the current user
            //     organizations = await store.dispatch('meta/getOrganizations')

            //     organizations.forEach((organization) => {
            //         reserve_queries.push(
            //             app.$fire.firestore.collection('requests')
            //                 .where('status', '==', 'reserved')
            //                 .where('repository.organization', '==', organization.id)
            //                 .orderBy('created_at', 'desc')
            //                 .get()
            //         )
            //     })

            //     reserved_requests = await Promise.all(reserve_queries)
            //     console.log('Reserved requests', reserved_requests)
            // }

            const requests = await app.$fire.firestore
                .collection('requests')
                .where('client_id', '==', store.getters['auth/activeUser'].uid)
                .orderBy('status', 'desc')
                .orderBy('created_at', 'desc')
                .get()

            let jobs = []

            const repo_ids = await store.dispatch('meta/getRepositoryIdsOwned')

            // Don't proceed unless we have repos.
            if (repo_ids.length > 0) {
                const jobs_collection = await app.$fire.firestore
                    .collection('requests')
                    .where('repository_id', 'in', repo_ids)
                    .where('status', '==', 'picked_up')
                    .orderBy('created_at', 'desc')
                    .get()
                jobs = jobs_collection.docs
            }

            /**
             * Filter out archived records
             */
            return {
                requests: requests.docs.filter(doc => !doc.request().isArchived()),
                jobs,
                organizations,
                reserved_requests
            }
        }
    },
    data () {
        return {
            requests: [],
            reserved_requests: [],
            jobs: [],
            organizations: [],
            selected: []
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser',
            isResearcher: 'meta/isResearcher',
            isSourcerer: 'meta/isSourcerer',
            isOrgMember: 'meta/isOrgMember'
        }),
        isLoggedIn () {
            return this.user && this.user.uid
        }
    },
    mounted () {
        // console.log(this.organizations)
    //   console.log(this.reserved_requests)
    },
    methods: {
        getOrganizationFromRequest (request) {
            const orgId = request.data().repository.organization
            let found = {}
            this.organizations.forEach((organization) => {
                if (organization.id === orgId) {
                    console.log('Found: ', organization.data())
                    found = organization.data()
                }
            })
            return found
        },
        claim () {
            console.log(this.reserved_requests)
            const updates = []
            this.selected.forEach((item) => {
                updates.push(
                    this.$fire.firestore.collection('requests').doc(item).update({
                        status: 'picked_up',
                        vendor_id: this.user.uid
                    })
                )
            })

            Promise.all(updates).then((values) => {
                // Not elegant. Need to change this
                window.location.reload()
            })
        },
        release () {
            const updates = []
            this.selected.forEach((item) => {
                updates.push(
                    this.$fire.firestore.collection('requests').doc(item).update({
                        status: 'pending'
                    })
                )
            })

            Promise.all(updates).then((values) => {
                // Not elegant. Need to change this
                window.location.reload()
            })
        }
    }
}
</script>

<style scoped>
.institutional-job {
    border: 1px solid var(--v-primary-base);
    padding: 1em
}
</style>
