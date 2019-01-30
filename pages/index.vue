<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <h1>Dashboard</h1>
      <v-list two-line>
        <v-subheader>Your Requests</v-subheader>
        <v-divider></v-divider>

        <v-list-tile v-if="requests.length == 0" to="/request/create">
          <v-list-tile-content>
            <v-list-tile-title>No Active Requests</v-list-tile-title>
            <v-list-tile-sub-title>Click to create a new request.</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple>
              <v-icon color="grey lighten-1">add_circle</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>

        <template v-for="(request, index) in requests">
          <v-list-tile
            v-if="request.status !== 'completed'"
            :key="index"
            :to="'/request/' + request.id"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ request.label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ request.citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-chip color="secondary" text-color="white">{{request.status.replace('_', ' ')}}</v-chip>
          </v-list-tile>
          <v-divider v-if="index + 1 < requests.length" :key="`divider-${index}`"></v-divider>
        </template>
      </v-list>


      <v-list two-line class="mt-5">
        <v-subheader>Your Jobs</v-subheader>
        <v-divider></v-divider>

        <v-list-tile v-if="jobs.length == 0" to="/jobs">
          <v-list-tile-content>
            <v-list-tile-title>No Active Jobs</v-list-tile-title>
            <v-list-tile-sub-title>Click to find available jobs.</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple>
              <v-icon color="grey lighten-1">search</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>

        <template v-for="(job, index) in jobs">
          <v-list-tile v-if="job.status !== 'completed'" :key="index" :to="'/jobs/' + job.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ job.label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ job.citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-chip color="secondary" text-color="white">{{job.status.replace('_', ' ')}}</v-chip>
          </v-list-tile>
          <v-divider v-if="index + 1 < jobs.length" :key="`divider-${index}`"></v-divider>
        </template>
      </v-list>

      <div class="text-xs-center mt-5">
        <v-btn color="primary" to="/request/history">View History</v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "~/plugins/firebase-client-init.js";
export default {
  name: "dashboard",
  async asyncData({ params, store }) {
    if (store.getters.activeUser.uid) {
      let requests = [];
      let requestsRef = await db
        .collection("requests")
        .where("client_id", "==", store.getters.activeUser.uid)
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
