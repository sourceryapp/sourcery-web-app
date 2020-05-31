<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 v-if="this.id !== null">
      <v-card>
        <StaticMap
            :alt="`Satellite image of ${this.data.repository.name}`"
            :repository="this.data.repository"
            ></StaticMap>
        <v-card-title>
            <div>
                <div class="headline">{{this.data.label}}</div>

                <span class="grey--text text--darken-4 citation">{{this.data.citation}}</span>

                <v-divider class="mt-3 mb-3"></v-divider>

                <div class="" style="text-transform:capitalize"><strong>Status</strong>: {{this.prettyStatus}}</div>
                <div class=""><strong>Repository</strong>: {{this.data.repository.institution}}</div>
            </div>
        </v-card-title>
        <v-card-actions>
          <!-- <v-btn color="primary" to="/">Edit</v-btn>
          <v-btn color="primary" @click="message=true">Delete</v-btn> -->
          <!-- <v-btn color="primary" to="/" v-if="this.isComplete'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
        </v-card-actions>
      </v-card>


        <v-dialog v-model="message" width="500">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>What are the options?</v-card-title>

            <v-card-text>
            <p>Can the user delete or edit?</p>
            <p>Maybe conditionally?</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="message = false">Close</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>


        <Attachments></Attachments>
    </v-flex>

  </v-layout>
</template>

<script>
import { db, storage, FieldValue } from "~/plugins/firebase-client-init.js";
import StaticMap from '~/components/static-map'
import Attachments from '~/components/attachments'
import { mapGetters } from 'vuex'


export default {
    name: "job-id",
    async asyncData({ params, store, error }) {
        // Populate the Vuex Store
        store.dispatch('request/init', params.id);
    },
    data() {
        return {
            record: null,
            message: null
        };
    },
    computed: {
        ...mapGetters({
            id: 'request/id',
            data: 'request/data',
            isComplete: 'request/isComplete',
            isPending: 'request/isPending',
            isPickedUp: 'request/isPickedUp',
            isArchived: 'request/isArchived',
            prettyStatus: 'request/prettyStatus',
        }),
    },
    components: {
        StaticMap,
        Attachments
    },
    methods: {

    },

};
</script>

<style scoped>


  .input-file {
    cursor: pointer;
  }

.citation {
    font-family: 'Courier New', Courier, monospace;
}
</style>
