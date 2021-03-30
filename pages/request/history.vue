<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <h1>History</h1>
      <v-list two-line>
        <v-subheader>Archived Requests</v-subheader>
        <v-divider />

        <v-list-tile v-if="requests.length == 0" to="/request/create">
          <v-list-tile-content>
            <v-list-tile-sub-title>No past requests found.</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <template v-for="(request, index) in requests">
          <v-list-tile :key="index" :to="'/request/' + request.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ request.data().label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ request.data().citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < requests.length" :key="`divider-${index}`" />
        </template>
      </v-list>

      <v-list two-line class="mt-5">
        <v-subheader>Completed Jobs</v-subheader>
        <v-divider />

        <v-list-tile v-if="jobs.length == 0" to="/jobs">
          <v-list-tile-content>
            <v-list-tile-sub-title>No past jobs found.</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <template v-for="(job, index) in jobs">
          <v-list-tile :key="index" :to="'/jobs/' + job.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ job.data().label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ job.data().citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < jobs.length" :key="`divider-${index}`" />
        </template>
      </v-list>

      <div class="text-center mt-5">
        <v-btn color="primary" to="/dashboard">
          Back
        </v-btn>
      </div>
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
