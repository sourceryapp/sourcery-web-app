<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        History
      </h1>
      <sourcery-card title="Your Archived Requests" icon="mdi-archive">
        <none-found-card v-if="requests.length == 0 || requests[0].id" text="No past requests found." to="/request/create">
          Create<span class="hidden-sm-and-down">&nbsp;Request</span>
          <v-icon right :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
            mdi-open-in-new
          </v-icon>
        </none-found-card>
        <v-list two-line color="transparent">
          <request-listing v-for="(request) in requests" :key="`arl-${request.id}`" :request="request" />
        </v-list>
      </sourcery-card>

      <sourcery-card v-if="isOrgMember" title="Organization Completed Requests" icon="mdi-archive">
        <none-found-card v-if="jobs.length == 0" text="No past requests found." />
        <template v-for="job in jobs">
          <v-hover
            v-slot="{ hover }"
            :key="`j-` + job.id"
          >
            <v-card
              v-if="job"
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
    </v-flex>
  </v-layout>
</template>

<script>
import NoneFoundCard from '@/components/none-found-card.vue'
import { mapGetters } from 'vuex'
import SourceryCard from '~/components/card-with-header.vue'
import RequestListing from '~/components/request-listing.vue'

export default {
    name: 'History',
    components: {
        'sourcery-card': SourceryCard,
        'none-found-card': NoneFoundCard,
        RequestListing
    },
    async asyncData ({ params, store, app }) {
        if (store.getters['auth/activeUser'].uid) {
            const requests = await app.$fire.firestore
                .collection('requests')
                .where('client_id', '==', store.getters['auth/activeUser'].uid)
                .where('status', '==', 'archived')
                .orderBy('created_at', 'desc')
                .get()
            console.log(requests.docs)
            return {
                requests: Array.from(requests.docs)
            }
        }
    },
    data () {
        return {
            requests: [],
            jobs: [],
            repositories_owned: []
        }
    },
    computed: {
        user () {
            return this.$store.getters['auth/activeUser']
        },
        ...mapGetters({
            isOrgMember: 'meta/isOrgMember'
        })
    },
    mounted () {
        this.retrieveRepositoryIdsOwned().then((ids) => {
            this.repositories_owned = ids
            this.fetchJobs()
        })
    },
    methods: {
        async retrieveRepositoryIdsOwned () {
            const ids = await this.$store.dispatch('meta/getRepositoryIdsOwned')
            return ids
        },
        async fetchJobs () {
            if (this.repositories_owned.length > 0) {
                const jobs = await this.$fire.firestore
                    .collection('requests')
                    .where('repository_id', 'in', this.repositories_owned)
                    .orderBy('created_at', 'desc')
                    .get()

                this.jobs = jobs.docs.filter(doc => doc.request().isArchived() || doc.request().isComplete())
            }
        }
    }
}
</script>

<style scoped>
</style>
