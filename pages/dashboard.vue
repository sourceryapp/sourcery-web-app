<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <h1>Dashboard</h1>


        <template v-for="(snapshot, index) in reserved_requests">
            <v-card flat :key="index" v-if="snapshot.size !== 0" class="mb-5">
                <v-card-title>Jobs to Claim or Release</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <div v-for="request in snapshot.docs" :key="request.id">
                        <v-checkbox color="primary" class="institutional-job" :hint="request.data().repository.name + ', ' + request.data().repository.institution" :persistent-hint="true"  v-model="selected" :label="request.data().citation" :value="request.id"></v-checkbox>
                    </div>
                </v-card-text>
                <v-card-actions style="display: flex; justify-content: space-between">
                    <v-btn color="primary" :disabled="selected.length < 1" @click="release()">Release</v-btn>
                    <v-btn color="primary" :disabled="selected.length < 1" @click="claim()">Claim</v-btn>
                </v-card-actions>
            </v-card>
        </template>

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
addToHomescreen();
export default {
    middleware: 'user-meta',

  name: "dashboard",
  async asyncData({ params, store }) {
    if (store.getters['auth/activeUser'].uid) {


        let organizations = null, reserve_queries = [], reserved_requests = null;
        if(store.getters['meta/isOrgMember']){

            // Get the organizations for the current user
            organizations = await store.dispatch('meta/getOrganizations');

            organizations.forEach(organization => {
                reserve_queries.push(
                    db.collection("requests")
                    .where("status", "==", "reserved")
                    .where("repository.organization", "==", organization.id)
                    .orderBy("created_at", "desc")
                    .get()
                );
            });

            reserved_requests = await Promise.all(reserve_queries);
            console.log("Reserved requests", reserved_requests);
        }



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
            jobs: jobs.docs,
            organizations,
            reserved_requests

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
      reserved_requests: [],
      jobs: [],
      organizations: [],
      selected: []
    };
  },
  methods: {
      getOrganizationFromRequest(request){
          let orgId = request.data().repository.organization;
          let found = {};
          this.organizations.forEach(organization => {
              if(organization.id == orgId){
                  console.log("Found: ", organization.data());
                found = organization.data();
              }
          });
          return found;
      },
      claim(){
          console.log(this.reserved_requests);
          let updates = [];
          this.selected.forEach(item => {
              updates.push(
                db.collection("requests").doc(item).update({
                    status: 'picked_up',
                    vendor_id: this.user.uid
                })
              );
          });

          Promise.all(updates).then(values => {
              // Not elegant. Need to change this
              window.location.reload();
          });
      },
      release(){
          let updates = [];
          this.selected.forEach(item => {
              updates.push(
                db.collection("requests").doc(item).update({
                    status: 'pending'
                })
              );
          });

          Promise.all(updates).then(values => {
              // Not elegant. Need to change this
              window.location.reload();
          });
      }
  },
  mounted() {
      console.log(this.organizations)
    //   console.log(this.reserved_requests)
  }
};
</script>

<style scoped>
.institutional-job {
    border: 1px solid var(--v-primary-base);
    padding: 1em
}
</style>


