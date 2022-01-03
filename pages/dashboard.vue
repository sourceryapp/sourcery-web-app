<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <logged-out-card />
      <sourcery-card v-if="user && isOrgMember" title="Requests Needing Service" class="mt-16" icon="mdi-briefcase">
        <none-found-card v-if="jobs.length == 0" text="This organization has no outstanding requests that need service." />

        <request-listing v-for="job in jobs" :key="`jl-${job.id}`" :request="job" />
      </sourcery-card>
      <sourcery-card v-if="user" title="Requests You Created" icon="mdi-file-search" class="mt-16">
        <none-found-card v-if="requests.length == 0" text="You have no active requests." to="/request/create">
          Create<span class="hidden-sm-and-down">&nbsp;Request</span>
          <v-icon right :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
            mdi-open-in-new
          </v-icon>
        </none-found-card>

        <request-listing v-for="(request) in requests" :key="`rl-${request.id}`" :request="request" />
      </sourcery-card>
      <view-history-button v-if="user" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import NoneFoundCard from '@/components/none-found-card.vue'
import SourceryCard from '~/components/card-with-header.vue'
import LoggedOutCard from '~/components/logged-out-card.vue'
import ViewHistoryButton from '~/components/view-history-button.vue'
import RequestListing from '~/components/request-listing.vue'

export default {
    name: 'Dashboard',
    components: {
        'sourcery-card': SourceryCard,
        'none-found-card': NoneFoundCard,
        LoggedOutCard,
        ViewHistoryButton,
        RequestListing
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
