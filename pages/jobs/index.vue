<template>
  <v-layout fill-height>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1>Find Jobs</h1>
      <v-alert
        icon="mdi-information"
        text
        type="info"
        class="mt-1"
      >
        During the beta, users can request documents located in the Boston and New York metro areas, and at the University of Connecticut.
      </v-alert>

      <!-- <v-alert
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
      </v-alert> -->

      <v-card
        outlined
      >
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Search Radius
          <v-spacer />
          <v-icon
            color="primary darken-2"
          >
            mdi-map-marker-radius
          </v-icon>
        </v-card-title>

        <v-divider />
        <v-card-text>
          <v-radio-group v-model="distance" row>
            <v-radio label="1 mile" :value="1" />
            <v-radio label="5 miles" :value="5" />
            <v-radio label="10 miles" :value="10" />
            <v-radio label="50 miles" :value="50" />
            <v-radio label="100 miles" :value="100" />
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn depressed color="primary" :loading="searching" @click="getLocation()">
            <v-icon left>
              mdi-briefcase-search
            </v-icon>
            Find Jobs Near Me
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-divider v-if="jobs" class="my-4" />

      <section v-if="jobs" id="results">
        <v-alert
          v-if="jobs.length==0 && !searching"
          :value="true"
          type="warning"
          prominent
        >
          Nothing found. Please try a larger search radius.
        </v-alert>

        <v-layout column fill-height>
          <h4 v-if="searching">
            Searching...
          </h4>
          <h2
            v-if="jobs.length>0 && !searching"
          >
            Results
          </h2>
          <template v-for="(job, index) in jobs">
            <v-card
              :key="index"
              class="my-1"
              :data-id="job.id"
              outlined
            >
              <v-card-title>
                {{ job.data().repository.name }}, {{ job.data().repository.city }}
              </v-card-title>
              <v-card-subtitle>
                {{ job.data().citation }}
              </v-card-subtitle>
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs2 align-center justify-center flexbox text-center>
                    <v-icon x-large>
                      mdi-map-marker-circle
                    </v-icon>
                  </v-flex>
                  <v-flex xs10 align-end flexbox>
                    {{ job.data().repository.name }}
                    <br>
                    {{ job.data().repository.address1 }}
                    <br>
                    {{ job.data().repository.city }}, {{ job.data().repository.state }} {{ job.data().repository.postal_code }}
                  </v-flex>
                  <!-- <v-flex>
                    <p
                      color="primary--text"
                      class="primary--text text-h3 font-weight-bold"
                      v-html="jobValue(job.data())"
                    />
                    <p class="grey--text text--darken-1">
                      (Estimated payout for a {{ job.data().pages }} page fulfillment.)
                    </p>
                  </v-flex> -->
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" depressed :disabled="!canReceivePayments || job.claimed" @click="claim(job.id)">
                  {{ job.claimed ? "Claimed" : "Claim" }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-layout>
      </section>
    </v-flex>
  </v-layout>
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
    beforeDestroy () {
    /**
         * Destroy the collection listener
         * @url https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener
         */
        this.listener()
    },
    mounted () {
    /**
         * Begin listening for updates to the
         * requests collection
         */
        this.listener = this.$fire.firestore.collection('requests')
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
    methods: {
        claim (id) {
            const uid = this.user.uid
            if (confirm('Are you sure that you want to claim this job?')) {
                this.$fire.firestore.collection('requests')
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
        findJobs ({ coords }) {
            console.log('find jobs running')
            this.searching = true
            this.userLat = coords.latitude
            this.userLong = coords.longitude
            const userID = this.user.uid

            this.$fire.firestore
                .collection('requests')
                .where('status', '==', 'pending')
                .get()
                .then((snapshot) => {
                    console.log('results', snapshot)
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
                            if ((miles <= this.distance) && doc.data().client_id !== userID) {
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
                    this.jobs = jobs
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        jobValue (job) {
            return this.$utils.jobValue(job)
        }
    }
}
</script>

<style scoped>
#search {
    background-color: #eee;
}
</style>
