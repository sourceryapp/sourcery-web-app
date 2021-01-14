<template>
  <v-layout>
    <v-flex v-if="id !== null" xs12 sm8 offset-sm2>
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
          <!-- <v-btn color="primary" to="/">Edit</v-btn>
          <v-btn color="primary" @click="message=true">Delete</v-btn> -->
          <!-- <v-btn color="primary" to="/" v-if="isComplete'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
        </v-card-actions>
      </v-card>

      <v-dialog v-model="message" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            What are the options?
          </v-card-title>

          <v-card-text>
            <p>Can the user delete or edit?</p>
            <p>Maybe conditionally?</p>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" flat @click="message = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <Attachments />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import StaticMap from '~/components/static-map'
import Attachments from '~/components/attachments'

export default {
    name: 'JobId',
    async asyncData ({ params, store, error }) {
        // Populate the Vuex Store
        await store.dispatch('request/init', params.id)
    },
    data () {
        return {
            record: null,
            message: null
        }
    },
    computed: {
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
    components: {
        StaticMap,
        Attachments
    },
    methods: {

    }

}
</script>

<style scoped>

  .input-file {
    cursor: pointer;
  }

.citation {
    font-family: 'Courier New', Courier, monospace;
}
</style>
