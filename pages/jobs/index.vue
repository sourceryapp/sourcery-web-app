<template>
  <v-flex>
    <v-layout column fill-height>
      <v-flex>
        <h1>Find Jobs</h1>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque unde ipsum perferendis enim illo? </p>

        <section class="pa-3" id="search">
          <v-layout row fill-height align-center justify-center wrap>
            <v-flex>
              <h3>Search Radius</h3>
              <v-radio-group v-model="distance" row>
                <v-radio label="50 miles" :value="50"></v-radio>
                <v-radio label="75 miles" :value="75"></v-radio>
                <v-radio label="100 miles" :value="100"></v-radio>
              </v-radio-group>
              <v-btn dark color="primary" @click="getLocation()">Find Jobs Near Me</v-btn>
            </v-flex>

            <!-- <v-flex xs12 sm4 grow text-xs-center>
                            OR
                        </v-flex>

                        <v-flex xs12 sm4 grow text-xs-center >
                            <v-text-field
                                solo
                                label="Postal Code"
                                :clearable="true"
                                :hide-details="true"
                                append-icon="search"
                                placeholder="coming soon..."
                                disabled
                            ></v-text-field>
            </v-flex>-->
          </v-layout>
        </section>
        <v-divider></v-divider>

        <section id="results" v-if="jobs" class="mt-4">
            <v-alert
            v-if="jobs.length==0"
            :value="true"
            type="info"
            >
            Nothing found. Please try a larger search radius.
            </v-alert>
          <v-list two-line>
            <template v-for="(job, index) in jobs">
              <v-card :key="index" class="mb-5">
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
                        class="primary--text display-3"
                      >${{ job.data().estimated_cost_usd }}</p>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-card-actions>
                  <v-btn color="primary" @click="claim()">Claim</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-list>
        </section>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { db } from "~/plugins/firebase-client-init.js";

/**
 * @url https://www.npmjs.com/package/geolib
 */
import geolib from "geolib";

export default {
    name: "jobs",
    data() {
        return {
            userLat: null,
            userLong: null,
            distance: 50,
            jobs: null
        };
    },
    methods: {
        claim(){
            /**
             * @todo all dis
             */
            alert('Not so fast, my friend.');
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
                            let miles = geolib.convertUnit(
                                "mi",
                                distanceMeters
                            );
                            if (miles <= this.distance) {
                                jobs.push(doc);
                            }
                        }
                    });
                    console.log(jobs);
                    return jobs;
                });
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
