<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        History
      </h1>

      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Archived Requests
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-archive
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list two-line>
          <v-list-item v-if="requests.length == 0">
            <v-list-item-content>
              <v-list-item-subtitle>No past requests found.</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="primary" text to="/request/create">
                Create <span class="hidden-sm-and-down">&nbsp;Request</span>
                <v-icon right>
                  mdi-open-in-new
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <template v-for="(request, index) in requests">
            <v-list-item :key="index" :to="'/request/' + request.id">
              <v-list-item-content>
                <v-list-item-title>{{ request.data().label }}</v-list-item-title>
                <v-list-item-subtitle>{{ request.data().citation }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index + 1 < requests.length" :key="`divider-${index}`" />
          </template>
        </v-list>
      </v-card>

      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Completed Jobs
          <v-spacer />
          <v-icon
            :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
          >
            mdi-archive
          </v-icon>
        </v-card-title>
        <v-divider />
        <v-list two-line>
          <v-list-item v-if="jobs.length == 0">
            <v-list-item-content>
              <v-list-item-subtitle>No past jobs found.</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="primary" text to="/jobs">
                Find Job
                <v-icon right>
                  mdi-open-in-new
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <template v-for="(job, index) in jobs">
            <v-list-item :key="index" :to="'/jobs/' + job.id">
              <v-list-item-content>
                <v-list-item-title>{{ job.data().label }}</v-list-item-title>
                <v-list-item-subtitle>{{ job.data().citation }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index + 1 < jobs.length" :key="`divider-${index}`" />
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
    name: 'History',
    async asyncData ({ params, store, app }) {
        if (store.getters['auth/activeUser'].uid) {
            const requests = await app.$fire.firestore
                .collection('requests')
                .where('client_id', '==', store.getters['auth/activeUser'].uid)
                .where('status', '==', 'archived')
                .orderBy('created_at', 'desc')
                .get()

            const jobs = await app.$fire.firestore
                .collection('requests')
                .where('vendor_id', '==', store.getters['auth/activeUser'].uid)
                .orderBy('created_at', 'desc')
                .get()

            return {
                requests: requests.docs,
                jobs: jobs.docs.filter(doc => doc.request().isArchived() || doc.request().isComplete())
            }
        }
    },
    data () {
        return {
            requests: [],
            jobs: []
        }
    },
    computed: {
        user () {
            return this.$store.getters['auth/activeUser']
        }
    },
    mounted () {
    // this.$axios
    //     .$get('/requests')
    //     .then(response => (this.requests = response.data));
    // console.log(this.requests.docs);
    }
}
</script>

<style scoped>
</style>
