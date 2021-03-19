<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <template v-if="!job.id">
        <!-- <h1>Not found</h1> -->
        <v-alert type="error" value="1">
          The request does not exist or was deleted.
        </v-alert>
        <v-btn color="primary" to="/">
          Dashboard
        </v-btn>
      </template>
      <template v-if="job.id">
        <v-card>
          <StaticMap
            :alt="`Satellite image of ${job.repository.name}`"
            :repository="job.repository"
          />
          <v-card-title>
            <div>
              <div class="headline">
                {{ job.label }}
              </div>

              <span class="grey--text text--darken-4 citation">{{ job.citation }}</span>

              <v-divider class="mt-3 mb-3" />

              <div class="" style="text-transform:capitalize">
                <strong>Status</strong>: {{ job.prettyStatus() }}
              </div>
              <div class="">
                <strong>Repository</strong>: {{ job.repository.institution }}
              </div>
            </div>
          </v-card-title>
          <v-card-actions>
            <!-- <v-btn color="primary" v-if="isPending" to="/">Edit</v-btn> -->
            <v-btn v-if="job.isPending()" color="primary" @click="cancel">
              Cancel
            </v-btn>
            <v-btn v-if="job.isComplete() && !job.isArchived()" color="primary" @click="archive">
              Archive
            </v-btn>
            <!-- <v-btn color="primary" to="/" v-if="record.status=='complete'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
          </v-card-actions>
        </v-card>

        <Attachments />

        <v-card v-if="job.isComplete()" class="mt-3">
          <v-card-title>
            <div class="headline" v-html="!job.userRating ? 'Please Rate the Sourcerer' : 'Thank you for rating your Sourcerer!'" />
          </v-card-title>
          <v-card-text>
            <v-rating
              v-model="job.userRating"
              background-color="primary lighten-3"
              color="primary"
              :readonly="isRatingSet"
            />
          </v-card-text>
          <v-card-actions v-if="!job.userRating">
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
import { Job } from '~/models/job'
import StaticMap from '~/components/static-map'
import Attachments from '~/components/attachments'

export default {
    name: 'RequestId',
    components: {
        StaticMap,
        Attachments
    },
    async asyncData ({ params, store, error, app }) {
        if (store.getters['auth/activeUser'].uid) {
            let job = false
            try {
                const doc = await app.$fire.firestore.collection('requests').doc(params.id).get()
                job = new Job(doc)
            } catch (error) {
                console.log(error)
            }
            return {
                job
            }
        }
    },
    data () {
        return {
            job: {
                id: false
            }
        }
    },
    computed: {
        isRatingSet () {
            return Boolean(this.job.userRating)
        }
    },
    mounted () {
        //  Listen for changes to this document
        if (this.job.exists) {
            this.job.ref.onSnapshot((doc) => { this.job = new Job(doc) })
        }
    },
    methods: {
        archive () {
            if (confirm('Are you sure you want to archive this item? This action cannot be undone.')) {
                this.job.ref.set({ status: 'archived' }, { merge: true }).then(() => {
                    this.$router.push({ name: 'dashboard' })
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        cancel () {
            if (confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
                this.job.ref.delete().then(() => {
                    this.$router.push({ name: 'dashboard' })
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        setRating () {
            if (confirm(`This action cannot be undone. Would you like to rate this Sourcerer ${this.rating} stars?`)) {
                this.job.ref.set({
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
