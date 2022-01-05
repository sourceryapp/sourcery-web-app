<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <template v-if="!id">
        <v-alert type="error" value="1">
          The request does not exist or was deleted.
        </v-alert>
        <v-btn color="primary" to="/">
          Dashboard
        </v-btn>
      </template>
      <template v-if="id">
        <v-card>
          <v-card-title>
            <div>
              <div class="text-h5">
                {{ data.label }}
              </div>

              <span :class="$vuetify.theme.dark ? 'citation' : 'grey--text text--darken-4 citation'">{{ data.citation }}</span>

              <v-divider class="mt-3 mb-3" />

              <div>
                <strong>Created</strong>: {{ dateCreated }}
              </div>

              <div class="" style="text-transform:capitalize">
                <strong>Status</strong>: {{ prettyStatus }}
              </div>
              <div class="">
                <strong>Repository</strong>: {{ data.repository.institution }}
              </div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn v-if="isPending" color="primary" @click="cancel">
              Cancel
            </v-btn>
            <v-btn v-if="isComplete && !isArchived" color="primary" @click="archive">
              Archive
            </v-btn>
          </v-card-actions>
        </v-card>

        <Attachments />
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Attachments from '@/components/attachments'

export default {
    name: 'RequestId',
    components: {
        Attachments
    },
    asyncData ({ params, store, error, app }) {
    // Populate the Vuex Store
        store.dispatch('request/init', params.id)

        if (store.getters['auth/activeUser'].uid) {
            return app.$fire.firestore.collection('requests').doc(params.id).get()
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
            record: false
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
        }),
        dateCreated () {
            if (this.data && this.data.created_at) {
                const t = new Date(Date.UTC(1970, 0, 1))
                t.setUTCSeconds(this.data.created_at.seconds)

                // Current Time
                const current = new Date()

                const diff = current.getTime() - t.getTime()
                const diffMinutes = (diff / 1000) / 60
                const minutes = Math.floor(diffMinutes % 60)
                const minutesAsString = minutes < 10 ? '0' + minutes : minutes

                const diffHours = Math.floor(diffMinutes / 60)
                const hours = diffHours % 24

                const diffDays = Math.floor(diffHours / 24)
                const days = diffDays

                const elapsedString = `Elapsed: ${days} days, ${hours} hours, ${minutesAsString} minutes`

                return `${t.toLocaleString('default', { month: 'long' })} ${t.getDate()}, ${t.getFullYear()} (${elapsedString})`
            }
            return null
        }
    },
    mounted () {
    //  Listen for changes to this document
        if (this.record && this.record.id) {
            this.$fire.firestore.collection('requests').doc(this.record.id).onSnapshot((doc) => { this.record = doc })
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
        cancel () {
            if (confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
                this.$store.dispatch('request/delete').then((result) => {
                    this.$router.push({ name: 'dashboard' })
                }).catch((error) => {
                    console.log(error)
                })
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
