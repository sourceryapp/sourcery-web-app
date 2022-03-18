<template>
  <v-layout>
    <v-flex xs12 sm10 xl6 offset-sm1 offset-xl3>
      <h1 class="mb-4">
        {{ pageTitle }}
      </h1>
      <logged-out-card />
      <org-stat-bar :new-count="newJobs.length" :progress-count="inProgressJobs.length" :completed-count="completedAndArchivedJobs.length" />

      <v-row>
        <v-col cols="12" md="6">
          <card-with-action title="New Requests" :number-requests="newJobs.length" action="/requests?status=1">
            <request-listing v-for="job in newJobsLimited" :key="`njl-${job.id}`" :request="job" :client="false" />
            <span v-if="newJobs.length === 0">No New Requests</span>
          </card-with-action>
          <card-with-action title="Recently Completed" :number-requests="completedJobs.length" action="/requests?status=3,4">
            <request-listing v-for="job in completedJobsLimited" :key="`cjl-${job.id}`" :number-requests="completedJobs.length" :request="job" :client="false" />
            <span v-if="completedJobs.length === 0">No Recently Completed Requests</span>
          </card-with-action>
        </v-col>
        <v-col cols="12" md="6">
          <card-with-action title="In - Progress" :number-requests="inProgressJobs.length" action="/requests?status=2">
            <request-listing v-for="job in inProgressJobsLimited" :key="`ipjl-${job.id}`" :request="job" :client="false" />
            <span v-if="inProgressJobs.length === 0">No In Progress Requests.</span>
          </card-with-action>
        </v-col>
      </v-row>
      <!-- <sourcery-card v-if="user && isOrgMember" title="Requests Needing Service" class="mt-8" icon="mdi-briefcase">
        <none-found-card v-if="jobs.length == 0" text="This organization has no outstanding requests that need service." />

        <request-listing v-for="job in jobs" :key="`jl-${job.id}`" :request="job" :client="false" />
      </sourcery-card> -->
      <sourcery-card v-if="user" title="Requests You Created" icon="mdi-file-search" class="mt-12">
        <none-found-card v-if="requests.length == 0" text="You have no active requests." to="/request/create">
          Create<span class="hidden-sm-and-down">&nbsp;Request</span>
          <v-icon right :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
            mdi-open-in-new
          </v-icon>
        </none-found-card>

        <request-listing v-for="(request) in requests" :key="`rl-${request.id}`" :request="request" :client="true" />
      </sourcery-card>
      <view-history-button v-if="user" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import NoneFoundCard from '@/components/none-found-card.vue'
import SourceryCard from '@/components/card-with-header.vue'
import CardWithAction from '@/components/card-with-action.vue'
import LoggedOutCard from '@/components/logged-out-card.vue'
import ViewHistoryButton from '@/components/view-history-button.vue'
import RequestListing from '@/components/request-listing.vue'
import OrgStatBar from '@/components/org-stat-bar.vue'
import { Request } from '~/models/Request'

export default {
    name: 'Dashboard',
    components: {
        SourceryCard,
        NoneFoundCard,
        LoggedOutCard,
        ViewHistoryButton,
        RequestListing,
        OrgStatBar,
        CardWithAction
    },
    async asyncData ({ params, store, app }) {
        const logged_in = store.getters['supabaseAuth/authUser'] && store.getters['supabaseAuth/authUser'].id
        let requests = []
        let jobs = []
        if (logged_in) {
            const uid = store.getters['supabaseAuth/authUser'].id
            requests = await Request.getForCreator(uid, ['Picked Up', 'Submitted', 'Complete'])
        }

        if (store.getters['supabaseAuth/ownsAnOrganization']) {
            const user_repositories = store.getters['supabaseAuth/userRepositories']
            jobs = await Request.getForRepositories(user_repositories, ['Picked Up', 'Submitted', 'Complete', 'Archived'])
        }

        return {
            requests,
            jobs,
            organizations: []
        }
    },
    data () {
        return {
            requests: [],
            jobs: [],
            organizations: [],
            limit: 4
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            isOrgMember: 'supabaseAuth/ownsAnOrganization'
        }),
        pageTitle () {
            if (this.isOrgMember) {
                return 'Institutional Dashboard'
            }
            return 'Dashboard'
        },
        newJobs () {
            return this.jobs.filter(x => x.status?.name === 'Submitted')
        },
        inProgressJobs () {
            return this.jobs.filter(x => x.status?.name === 'Picked Up')
        },
        completedJobs () {
            return this.jobs.filter(x => x.status?.name === 'Complete')
        },
        completedAndArchivedJobs () {
            return this.jobs.filter(x => x.status?.name === 'Complete' || x.status?.name === 'Archived')
        },
        newJobsLimited () {
            return this.newJobs.slice(0, this.limit)
        },
        inProgressJobsLimited () {
            return this.inProgressJobs.slice(0, this.limit)
        },
        completedJobsLimited () {
            return this.completedJobs.slice(0, this.limit)
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
