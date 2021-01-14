<template>
  <v-layout row fill-height>
    <v-flex xs12 sm8 offset-sm2>
      <h1>Find Jobs</h1>
      <p>During the beta, users can request documents located in the Boston and New York metro areas, and at the University of Connecticut.</p>

      <v-alert
        :value="!canReceivePayments"
        type="warning"
        class="mt-4 mb-4"
      >
        <v-layout>
          <div>Before claiming a job request, you must configure your account to receive payments.</div>
          <v-btn :to="{name: 'account-payouts'}">
            Configure
          </v-btn>
        </v-layout>
      </v-alert>

      <section id="search" class="pa-3">
        <v-layout row fill-height align-center justify-center wrap>
          <v-flex>
            <h3>Search Radius</h3>
            <v-radio-group v-model="distance" row>
              <v-radio label="1 mile" :value="1" />
              <v-radio label="5 miles" :value="5" />
              <v-radio label="10 miles" :value="10" />
              <v-radio label="50 miles" :value="50" />
              <v-radio label="100 miles" :value="100" />
            </v-radio-group>
            <v-btn dark color="primary" :loading="searching" @click="getLocation()">
              Find Jobs Near Me
            </v-btn>
          </v-flex>
        </v-layout>
      </section>
      <v-divider />

      <section v-if="jobs" id="results" class="mt-4">
        <v-alert
          v-if="jobs.length==0 && !searching"
          :value="true"
          type="info"
        >
          Nothing found. Please try a larger search radius.
        </v-alert>

        <v-layout column fill-height>
          <h4 v-if="searching">
            Searching...
          </h4>

          <template v-for="(job, index) in jobs">
            <v-flex :key="index" xs12 sm6 lg4 xl3>
              <v-card class="ma-2" :data-id="job.id">
                <v-card-title primary-title>
                  <div>
                    <h3
                      class="headline mb-0"
                    >
                      {{ job.data().repository.name }}, {{ job.data().repository.city }}
                    </h3>
                    <p class="grey--text text--darken-1">
                      {{ job.data().citation }}
                    </p>
                  </div>
                </v-card-title>
                <v-container fill-height fluid>
                  <v-layout fill-height>
                    <v-flex xs2 align-center justify-center flexbox text-xs-center>
                      <v-icon x-large>
                        location_on
                      </v-icon>
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
                      />
                      <p class="grey--text text--darken-1">
                        (Estimated payout for a {{ job.data().pages }} page fulfillment.)
                      </p>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-card-actions>
                  <v-btn color="primary" :disabled="!canReceivePayments || job.claimed" @click="claim(job.id)">
                    {{ job.claimed ? "Claimed" : "Claim" }}
                  </v-btn>
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

/**
 * @url https://www.npmjs.com/package/geolib
 */
import * as geolib from 'geolib'
import { mapGetters } from 'vuex'

export default {
    name: 'Jobs',
    data () {
        return {
            userLat: null,
            userLong: null,
            distance: 50,
            jobs: null,
            searching: false,

            /**
             * An array of current document listeners.
             * We listen to make sure a document isn't claimed
             * before the current user tried to claim it.
             * @url https://firebase.google.com/docs/firestore/query-data/listen
             */
            listener: null
        }
    },
    methods: {
        claim (id) {
            const uid = this.user.uid
            if (confirm('Are you sure that you want to claim this job?')) {
                $fire.firestore.collection('requests')
                    .doc(id)
                    .set({
                        vendor_id: uid,
                        status: 'picked_up'
                    }, {
                        merge: true
                    })
                    .then((ref) => {
                        this.$router.push('/dashboard')
                    })
            }
        },
        getLocation () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.findJobs)
            } else {
                alert('Your browser or device does not support this feature.')
            }
        },
        /**
         * @todo This will need to go in Vuex at some point.
         * @todo Once Firestore supports geoqueries, we can remove the geolib library and client-side
         *       calculations. Otherwise these queries will get pretty heavy.
         */
        async findJobs ({ coords }) {
            this.searching = true
            this.userLat = coords.latitude
            this.userLong = coords.longitude
            const userID = this.user.uid

            this.jobs = await db
                .collection('requests')
                .where('status', '==', 'pending')
                .get()
                .then((snapshot) => {
                    const jobs = []
                    snapshot.docs.forEach((doc) => {
                        if (doc.data().repository) {
                            const distanceMeters = geolib.getDistance(
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
                            )
                            const miles = geolib.convertDistance(distanceMeters, 'mi')

                            // Don't allow users to claim their own (disabling for testing)
                            // if ( (miles <= this.distance) && (doc.data().client_id != this.user.uid) ) {
                            if ((miles <= this.distance) && doc.data().client_id != userID) {
                                /**
                                 * Using this to track whether the request gets claimed
                                 * while the user is browsing the results
                                 */
                                const claimedProperty = { claimed: false }

                                /**
                                 * Push the document (and claimed property) to the jobs array
                                 */
                                jobs.push(Object.assign(doc, claimedProperty))
                            }
                        }
                    })
                    this.searching = false
                    return jobs
                })
        },
        jobValue (job) {
            return this.$utils.jobValue(job)
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser',
            isResearcher: 'meta/isResearcher',
            isSourcerer: 'meta/isSourcerer',
            balance: 'meta/balance',
            canMakePayments: 'meta/canMakePayments',
            canReceivePayments: 'meta/canReceivePayments'
        })

    },

    mounted () {
    /**
         * Begin listening for updates to the
         * requests collection
         */
        this.listener = $fire.firestore.collection('requests')
            .where('status', '==', 'pending')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    /**
                     * If a request is removed (no longer in the collection
                     * that we're listening to). That is, the status is not
                     * equal to "pending"
                     */
                    if (change.type === 'removed') {
                        const changed_id = change.doc.id
                        console.log('Removed:', changed_id)
                        /**
                         * If the changed ID is in our result list,
                         * disable the option to claim the request.
                         */
                        this.jobs.forEach((job, index) => {
                            if (job.id === changed_id) {
                                console.log(this.jobs[index].claimed)
                                this.jobs[index].claimed = true
                                console.log(this.jobs[index])
                            }
                        })
                    }
                })
            })
    },
    beforeDestroy () {
    /**
         * Destroy the collection listener
         * @url https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener
         */
        this.listener()
    }
}
</script>

<style scoped>
#search {
    background-color: #eee;
}
</style>
