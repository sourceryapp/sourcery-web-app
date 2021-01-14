<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <template v-if="!id">
        <!-- <h1>Not found</h1> -->
        <v-alert type="error" value="1">
          The request does not exist or was deleted.
        </v-alert>
        <v-btn color="primary" to="/">
          Dashboard
        </v-btn>
      </template>
      <template v-if="id">
        <v-card>
          <StaticMap
            :alt="`Satellite image of ${data.repository.name}`"
            :repository="data.repository"
          />
          <v-card-title>
            <div>
              <div class="headline">
                {{ data.label }}
              </div>

              <span class="grey--text text--darken-4 citation">{{ data.citation }}</span>

              <v-divider class="mt-3 mb-3" />

              <div class="" style="text-transform:capitalize">
                <strong>Status</strong>: {{ prettyStatus }}
              </div>
              <div class="">
                <strong>Repository</strong>: {{ data.repository.institution }}
              </div>
            </div>
          </v-card-title>
          <v-card-actions>
            <!-- <v-btn color="primary" v-if="isPending" to="/">Edit</v-btn> -->
            <v-btn v-if="isPending" color="primary" @click="cancel">
              Cancel
            </v-btn>
            <v-btn v-if="isComplete && !isArchived" color="primary" @click="archive">
              Archive
            </v-btn>
            <!-- <v-btn color="primary" to="/" v-if="record.status=='complete'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
          </v-card-actions>
        </v-card>

        <!-- <v-card v-if="isComplete" class="mt-3">
                <v-card-title>
                    <div>
                        <div class="headline">Download Images</div>

                        <div><span class="grey--text text--darken-4">Click/Touch each image to download.</span></div>
                    </div>
                </v-card-title>
                <v-layout row wrap>
                <v-flex xs3 v-for="(image, index) in data.attachments" :key="index" class="pa-2">
                    <a :href="image" target="_blank" download>
                        <v-img v-if="!image.includes('.pdf')" :src="image" :alt="`Attachment #${index+1}`" aspect-ratio="1"></v-img>
                        <v-responsive v-else :aspect-ratio = "1">
                            <embed :src="image" type="application/pdf"/>
                            <span class="grey--text text--darken-4">Click to Download</span>
                        </v-responsive>
                    </a>
                </v-flex>
                </v-layout>

            </v-card> -->

        <Attachments />

        <v-card v-if="isComplete" class="mt-3">
          <v-card-title>
            <div class="headline" v-html="!isRatingSet ? 'Please Rate the Sourcerer' : 'Thank you for rating your Sourcerer!'" />
          </v-card-title>
          <v-card-text>
            <v-rating
              v-model="rating"
              background-color="primary lighten-3"
              color="primary"
              :readonly="isRatingSet"
            />
          </v-card-text>
          <v-card-actions v-if="!isRatingSet">
            <v-btn color="primary" @click="setRating">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import StaticMap from '~/components/static-map'
import Attachments from '~/components/attachments'

export default {
    name: 'RequestId',
    components: {
        StaticMap,
        Attachments
    },
    // async asyncData({ params, store, error }) {
    //     if (store.getters['auth/activeUser'].uid) {
    //         return $fire.firestore.collection("requests").doc(params.id).get()
    //         .then(doc => {
    //             return {
    //                 record: (doc.exists) ? doc : false,
    //                 rating: (doc.exists) ? doc.data().userRating : 0
    //             }
    //         })
    //         .catch((e) => {
    //             console.log(e)
    //         })
    //     }

    // },
    async asyncData ({ params, store, error }) {
    // Populate the Vuex Store
        store.dispatch('request/init', params.id)

        if (store.getters['auth/activeUser'].uid) {
            return $fire.firestore.collection('requests').doc(params.id).get()
                .then((doc) => {
                    return {
                        record: (doc.exists) ? doc : false,
                        rating: (doc.exists) ? doc.data().userRating : 0
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    },
    data () {
        return {
            record: false,
            rating: 0
            // ratingSent: false
        }
    },
    computed: {
        isRatingSet () {
            return Boolean(this.data.userRating)
        },
        ...mapGetters({
            id: 'request/id',
            data: 'request/data',
            isComplete: 'request/isComplete',
            isPending: 'request/isPending',
            isPickedUp: 'request/isPickedUp',
            isArchived: 'request/isArchived',
            prettyStatus: 'request/prettyStatus'
        })
    },
    mounted () {
    //  Listen for changes to this document
        if (this.record && this.record.id) {
            $fire.firestore.collection('requests').doc(this.record.id).onSnapshot((doc) => { this.record = doc })
        }
    },
    methods: {
        archive () {
            if (confirm('Are you sure you want to archive this item? This action cannot be undone.')) {
                this.$store.dispatch('request/markArchived').then((result) => {
                    this.$router.push({ name: 'dashboard' })
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        async cancel () {
            if (confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
                this.$store.dispatch('request/delete').then((result) => {
                    this.$router.push({ name: 'dashboard' })
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        async setRating () {
            if (confirm(`This action cannot be undone. Would you like to rate this Sourcerer ${this.rating} stars?`)) {
                $fire.firestore.collection('requests').doc(this.record.id).set({
                    userRating: this.rating
                }, { merge: true })
            }
        }
    }
}
</script>

<style scoped>
.citation {
    font-family: 'Courier New', Courier, monospace;
}
</style>
