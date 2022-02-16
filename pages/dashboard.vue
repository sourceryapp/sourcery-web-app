<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        Dashboard
      </h1>
      <logged-out-card />
      <org-stat-bar v-if="false" />
      <sourcery-card v-if="user && isOrgMember" title="Requests Needing Service" class="mt-8" icon="mdi-briefcase">
        <none-found-card v-if="jobs.length == 0" text="This organization has no outstanding requests that need service." />

        <request-listing v-for="job in jobs" :key="`jl-${job.id}`" :request="job" :client="false" />
      </sourcery-card>
      <sourcery-card v-if="user" title="Requests You Created" icon="mdi-file-search" class="mt-12">
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
import SourceryCard from '@/components/card-with-header.vue'
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
        OrgStatBar
    },
    async asyncData ({ params, store, app }) {
        const logged_in = store.getters['supabaseAuth/authUser'] && store.getters['supabaseAuth/authUser'].id
        let requests = []
        let jobs = []
        if (logged_in) {
            const uid = store.getters['supabaseAuth/authUser'].id
            requests = await Request.getForCreator(uid)
        }

        if (store.getters['supabaseAuth/ownsAnOrganization']) {
            const user_repositories = store.getters['supabaseAuth/userRepositories']
            jobs = await Request.getForRepositories(user_repositories)
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
            selected: []
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            isOrgMember: 'supabaseAuth/ownsAnOrganization'
        }),
        isLoggedIn () {
            return this.user && this.user.uid
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
