<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <h1>History</h1>
      <v-list two-line>
        <v-subheader>Past Requests</v-subheader>
        <v-divider></v-divider>

        <v-list-tile v-if="requests.length == 0" to="/request/create">
          <v-list-tile-content>
            <v-list-tile-sub-title>No past requests found.</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <template v-for="(request, index) in requests">
          <v-list-tile :key="index" :to="'/request/' + request.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ request.label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ request.citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < requests.length" :key="`divider-${index}`"></v-divider>
        </template>
      </v-list>


      <v-list two-line class="mt-5">
        <v-subheader>Past Jobs</v-subheader>
        <v-divider></v-divider>

        <v-list-tile v-if="jobs.length == 0" to="/jobs">
          <v-list-tile-content>
            <v-list-tile-sub-title>No past jobs found.</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <template v-for="(job, index) in jobs">
          <v-list-tile :key="index" :to="'/request/' + job.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ job.label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ job.citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < jobs.length" :key="`divider-${index}`"></v-divider>
        </template>
      </v-list>

      <div class="text-xs-center mt-5">
        <v-btn color="primary" to="/">Back</v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "~/plugins/firebase-client-init.js";
export default {
  name: "history",
  async asyncData({ params, store }) {
    if (store.getters.activeUser.uid) {
      let requests = [];
      let requestsRef = await db
        .collection("requests")
        .where("client_id", "==", store.getters.activeUser.uid)
        .where("status", "==", "completed")
        .orderBy("created_at", "desc")
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(function(doc) {
            requests.push(Object.assign({ id: doc.id }, doc.data()));
          });
        });

      let jobs = [];
      let jobsRef = await db
        .collection("requests")
        .where("vendor_id", "==", store.getters.activeUser.uid)
        .where("status", "==", "completed")
        .orderBy("created_at", "desc")
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(function(doc) {
            jobs.push(Object.assign({ id: doc.id }, doc.data()));
          });
        });

      return {
        requests: requests,
        jobs: jobs
      };
    }
  },
  computed: {
    user() {
      return this.$store.getters.activeUser;
    }
  },
  data: function() {
    return {
      requests: [],
      jobs: []
    };
  },
  mounted() {
    // this.$axios
    //     .$get('/requests')
    //     .then(response => (this.requests = response.data));
  }
};
</script>

<style scoped>
</style>
