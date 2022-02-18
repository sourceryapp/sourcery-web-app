<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <template v-if="!id">
        <v-alert type="error" :value="true">
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
                {{ request.request_client.label }}
              </div>

              <span :class="$vuetify.theme.dark ? 'citation' : 'grey--text text--darken-4 citation'">{{ request.citation }}</span>

              <v-divider class="mt-3 mb-3" />

              <div>
                <strong>Created</strong>: {{ dateCreated }}
              </div>

              <div class="" style="text-transform:capitalize">
                <strong>Status</strong>: {{ prettyStatus }}
              </div>
              <div class="">
                <strong>Repository</strong>: {{ request.repository.name }}
              </div>
            </div>
          </v-card-title>
          <v-card-actions v-if="isOwner">
            <v-btn v-if="isSubmitted" color="primary" @click="cancel">
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
import { mapGetters, mapActions } from 'vuex'
import Attachments from '@/components/attachments'

export default {
    name: 'RequestId',
    components: {
        Attachments
    },
    async asyncData ({ params, store }) {
    // Populate the Vuex Store
        await store.dispatch('supabaseRequest/getById', params.id)
    },
    computed: {
        ...mapGetters({
            id: 'supabaseRequest/id',
            request: 'supabaseRequest/request',
            isComplete: 'supabaseRequest/isComplete',
            isPickedUp: 'supabaseRequest/isPickedUp',
            isArchived: 'supabaseRequest/isArchived',
            isSubmitted: 'supabaseRequest/isSubmitted',
            prettyStatus: 'supabaseRequest/prettyStatus',
            user: 'supabaseAuth/authUser'
        }),
        dateCreated () {
            if (this.request && this.request.created_at) {
                const t = new Date(Date.UTC(1970, 0, 1))
                const c = new Date(this.request.created_at)
                t.setUTCSeconds(c.getTime() / 1000)

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
        },
        isOwner () {
            return this.user.id === this.request.user_id
        }
    },
    methods: {
        ...mapActions({
            requestCancel: 'supabaseRequest/cancel',
            requestArchive: 'supabaseRequest/archive'
        }),
        async archive () {
            if (confirm('Are you sure you want to archive this item? This action cannot be undone.')) {
                const archive_status = await this.requestArchive()
                if (archive_status) {
                    this.$router.push({ name: 'dashboard' })
                } else {
                    console.log('Error archiving request.')
                }
            }
        },
        async cancel () {
            if (confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
                const delete_status = await this.requestCancel()
                if (delete_status) {
                    this.$router.push({ name: 'dashboard' })
                } else {
                    console.log('Error deleting request.')
                }
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
