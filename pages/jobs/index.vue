<template>
    <v-layout row fill-height>
      <v-flex xs12 sm8 offset-sm2>
        <h1>Find Jobs</h1>
        <p>During the beta, users can request documents located in the Boston and New York metro areas, and at the Unviersity of Connecticut.</p>

        <section class="pa-3" id="search">
          <v-layout row fill-height align-center justify-center wrap>
            <v-flex>
              <h3>Search Radius</h3>
              <v-radio-group v-model="distance" row>
                <v-radio label="1 mile" :value="1"></v-radio>
                <v-radio label="5 miles" :value="5"></v-radio>
                <v-radio label="10 miles" :value="10"></v-radio>
                <v-radio label="50 miles" :value="50"></v-radio>
                <v-radio label="100 miles" :value="100"></v-radio>
              </v-radio-group>
              <v-btn dark color="primary" @click="getLocation()" :disabled="searching">Find Jobs Near Me</v-btn>
            </v-flex>

          </v-layout>
        </section>
        <v-divider></v-divider>

        <section id="results" v-if="jobs" class="mt-4">


          <v-alert
            v-if="jobs.length==0 && !searching"
            :value="true"
            type="info"
          >Nothing found. Please try a larger search radius.</v-alert>



          <v-layout column fill-height>

            <h4 v-if="searching">Searching...</h4>

            <template v-for="(job, index) in jobs">
              <v-flex xs12 sm6 lg4 xl3 v-bind:key="index">
                <v-card class="ma-2" :data-id=job.id>
                  <v-card-title primary-title>
                    <div>
                      <h3
                        class="headline mb-0"
                      >{{ job.data().repository.name }}, {{ job.data().repository.city }}</h3>
                      <p class="grey--text text--darken-1">{{ job.data().citation }}</p>
                    </div>
                  </v-card-title>
                  <v-container fill-height fluid>
                    <v-layout fill-height>
                      <v-flex xs2 align-center justify-center flexbox text-xs-center>
                        <v-icon x-large>location_on</v-icon>
                      </v-flex>
                      <v-flex xs10 align-end flexbox>
                        {{ job.data().repository.name }}
                        <br>
                        {{ job.data().repository.address1 }}
                        <br>
                        {{ job.data().repository.city }}, {{ job.data().repository.state }} {{ job.data().repository.postal_code }}
                      </v-flex>
                      <v-flex>
                        <p
                          color="primary--text"
                          class="primary--text display-2"
                          v-html="jobValue(job.data())"
                        ></p>
                        <p class="grey--text text--darken-1">(Estimated payout for a {{ job.data().pages }} page fulfillment.)</p>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-card-actions>
                    <v-btn color="primary" @click="claim(job.id)">Claim</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </template>
          </v-layout>
        </section>
      </v-flex>
    </v-layout>
</template>

<script>
import { db } from "~/plugins/firebase-client-init.js";

/**
 * @url https://www.npmjs.com/package/geolib
 */
import * as geolib from "geolib";

import { Utils } from '~/modules/utilities'


export default {
    name: "jobs",
    data() {
        return {
            userLat: null,
            userLong: null,
            distance: 50,
            jobs: null,
            searching: false
        };
    },
    methods: {
        claim(id) {
            let router = this.$router;
            let uid = this.user.uid;
            db.collection("requests")
                .doc(id)
                .set({
                    vendor_id: uid,
                    status: "picked_up"
                }, {
                    merge: true
                })
                .then(function(ref) {
                    router.push("/");
                });
        },
        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.findJobs);
            } else {
                alert("Your browser or device does not support this feature.");
            }
        },
        /**
         * @todo This will need to go in Vuex at some point.
         * @todo Once Firestore supports geoqueries, we can remove the geolib library and client-side
         *       calculations. Otherwise these queries will get pretty heavy.
         */
        async findJobs({ coords }) {
            this.searching = true;
            this.userLat = coords.latitude;
            this.userLong = coords.longitude;

            this.jobs = await db
                .collection("requests")
                .where("status", "==", "pending")
                .get()
                .then(snapshot => {
                    let jobs = [];
                    snapshot.docs.forEach(doc => {
                        if (doc.data().repository) {
                            let distanceMeters = geolib.getDistance(
                                {
                                    latitude: this.userLat,
                                    longitude: this.userLong
                                },
                                {
                                    latitude: doc.data().repository.geo
                                        .latitude,
                                    longitude: doc.data().repository.geo
                                        .longitude
                                }
                            );
                            let miles = geolib.convertDistance(distanceMeters, "mi");

                            // Don't allow users to claim their own (disabling for testing)
                            // if ( (miles <= this.distance) && (doc.data().client_id != this.user.uid) ) {
                            if ( (miles <= this.distance) ) {
                                jobs.push(doc);
                            }
                        }
                    });
                    this.searching = false
                    return jobs;
                });
        },
        jobValue(job) {
            return Utils.jobValue(job);
        }
    },
    computed: {
        user() {
            return this.$store.getters['auth/activeUser'];
        }
    },
    mounted() {}
};
</script>

<style scoped>
#search {
    background-color: #eee;
}
</style>
