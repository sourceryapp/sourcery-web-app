<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        Dashboard
      </h1>

      <!-- <template v-for="(snapshot, index) in reserved_requests">
        <v-card v-if="snapshot.size !== 0" :key="index" flat class="mb-5">
          <v-card-title>Jobs to Claim or Release</v-card-title>
          <v-divider />
          <v-card-text>
            <div v-for="request in snapshot.docs" :key="request.id">
              <v-checkbox
                v-model="selected"
                color="primary"
                class="institutional-job"
                :hint="request.data().repository.name + ', ' + request.data().repository.institution"
                :persistent-hint="true"
                :label="request.data().citation"
                :value="request.id"
              />
            </div>
          </v-card-text>
          <v-card-actions style="display: flex; justify-content: space-between">
            <v-btn color="primary" :disabled="selected.length < 1" @click="release()">
              Release
            </v-btn>
            <v-btn color="primary" :disabled="selected.length < 1" @click="claim()">
              Claim
            </v-btn>
          </v-card-actions>
        </v-card>
      </template> -->
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Your Requests
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-file-search
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list two-line>
          <v-list-item v-if="requests.length == 0">
            <v-list-item-content>
              <v-list-item-title>No Active Requests</v-list-item-title>
              <v-list-item-subtitle>Click to create a new request.</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon ripple to="/request/create">
                <v-icon color="grey">
                  mdi-plus-circle
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <template v-for="(request, index) in requests">
            <v-list-item
              v-if="requests && !request.request().isArchived()"
              :key="request.id"
              :to="'/request/' + request.id"
            >
              <v-list-item-content>
                <v-list-item-title
                  class="text-truncate"
                >
                  {{ request.data().label }}
                </v-list-item-title>
                <v-list-item-subtitle
                  class="text-truncate"
                >
                  {{ request.data().citation }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-chip
                color="deep-purple lighten-5"
                text-color="primary darken-2"
                style="text-transform: capitalize"
              >
                {{ request.request().prettyStatus() }}
              </v-chip>
            </v-list-item>
            <v-divider v-if="index + 1 < requests.length" :key="`divider-${index}`" />
          </template>
        </v-list>
      </v-card>

      <!-- <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Your Wishlist
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-playlist-star
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list two-line>
          <v-list-item v-if="requests.length == 0">
            <v-list-item-content>
              <v-list-item-title>No Active Requests</v-list-item-title>
              <v-list-item-subtitle>Click to create a new request.</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon ripple to="/request/create">
                <v-icon color="grey">
                  mdi-plus-circle
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <template v-for="(request, index) in requests">
            <v-list-item
              v-if="requests && !request.request().isArchived()"
              :key="request.id"
              :to="'/request/' + request.id"
            >
              <v-list-item-content>
                <v-list-item-title
                  class="text-truncate"
                >
                  {{ request.data().label }}
                </v-list-item-title>
                <v-list-item-subtitle
                  class="text-truncate"
                >
                  {{ request.data().citation }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-chip
                color="deep-purple lighten-5"
                text-color="primary darken-2"
                style="text-transform: capitalize"
              >
                {{ request.request().prettyStatus() }}
              </v-chip>
            </v-list-item>
            <v-divider v-if="index + 1 < requests.length" :key="`divider-${index}`" />
          </template>
        </v-list>
      </v-card> -->

      <v-card
        outlined
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Your Jobs
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-briefcase
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list two-line>
          <v-list-item v-if="jobs.length == 0">
            <v-list-item-content>
              <v-list-item-title>No Active Jobs</v-list-item-title>
              <!-- <v-list-item-subtitle>Click to find available jobs.</v-list-item-subtitle> -->
            </v-list-item-content>
            <!-- <v-list-item-action>
            <v-btn icon ripple to="/jobs">
              <v-icon color="grey">
                mdi-magnify
              </v-icon>
            </v-btn>
            </v-list-item-action> -->
          </v-list-item>

          <template v-for="(job, index) in jobs">
            <v-list-item :key="index" :to="'/jobs/' + job.id">
              <v-list-item-content>
                <v-list-item-title>{{ job.data().label }}</v-list-item-title>
                <v-list-item-subtitle>{{ job.data().citation }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-chip color="secondary" text-color="white">
                {{ job.request().prettyStatus() }}
              </v-chip>
            </v-list-item>
            <v-divider v-if="index + 1 < jobs.length" :key="`divider-${index}`" />
          </template>
        </v-list>
      </v-card>

      <div class="text-center mt-5">
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
import { Organization } from '~/models'

const org = new Organization()
org.name = 'something'
// TODO Not sure why addToHomeScreen is here
// addToHomescreen()
export default {
    // middleware: 'auth-guard',

    name: 'Dashboard',
    async asyncData ({ params, store, app }) {
        if (store.getters['auth/activeUser'].uid) {
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
        })
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
