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


        <template  v-for="(request, index) in requests">
          <v-list-tile
          v-if="requests && !request.request().isArchived()"
          :key="request.id"
          :to="'/request/' + request.id"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ request.data().label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ request.data().citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-chip color="secondary" text-color="white">{{request.request().prettyStatus()}}</v-chip>
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
          <v-list-tile :key="index" :to="'/jobs/' + job.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ job.data().label }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ job.data().citation }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <!-- <v-chip color="secondary" text-color="white">{{job.request().prettyStatus()}}</v-chip> -->
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
import { mapGetters } from 'vuex'
export default {
    middleware: 'user-meta',

  name: "dashboard",
  async asyncData({ params, store }) {
    if (store.getters['auth/activeUser'].uid) {

        let requests = await db
        .collection("requests")
        .where("client_id", "==", store.getters['auth/activeUser'].uid)
        .orderBy("created_at", "desc")
        .get();

        let jobs = await db
        .collection("requests")
        .where("vendor_id", "==", store.getters['auth/activeUser'].uid)
        .where("status", "==", "picked_up")
        .orderBy("created_at", "desc")
        .get();

        /**
         * Filter out archived records
         */
        return {
            requests: requests.docs.filter( doc => !doc.request().isArchived() ),
            jobs: jobs.docs
        };
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
  data: function() {
    return {
      requests: [],
      jobs: []
    };
  },
  mounted() {

  }
};
</script>

<style scoped>
</style>
