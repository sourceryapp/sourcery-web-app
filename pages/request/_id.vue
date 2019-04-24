<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 v-if="request !== null">
      <h1></h1>

      <v-card>
        <StaticMap
            :alt="`Satellite image of ${repository.name}`"
            :lat="repository.geo._lat"
            :long="repository.geo._long"
            ></StaticMap>
        <v-card-title>
            <div>
                <div class="headline">{{request.label}}</div>

                <span class="grey--text text--darken-4 citation">{{request.citation}}</span>

                <v-divider class="mt-3 mb-3"></v-divider>

                <div class=""><strong>Status</strong>: {{request.status}}</div>
                <div class=""><strong>Repository</strong>: {{request.repository.institution}}</div>
            </div>
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" to="/">Edit</v-btn>
          <v-btn color="primary" @click="message=true">Delete</v-btn>
          <!-- <v-btn color="primary" to="/" v-if="request.status=='complete'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
        </v-card-actions>
      </v-card>

      <v-card v-if="request.status === 'complete'" class="mt-3">
        <v-card-title>
            <div>
                <div class="headline">Download Images</div>

                <div><span class="grey--text text--darken-4">Click/Touch each image to download.</span></div>
            </div>
        </v-card-title>
        <v-layout row wrap>
          <v-flex xs3 v-for="(image, index) in request.attachments" :key="index" class="pa-2">
            <a :href="image" target="_blank" download>
                <v-img :src="image" :alt="`Attachment #${index+1}`" aspect-ratio="1"></v-img>
            </a>
          </v-flex>
        </v-layout>

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
    </v-flex>
  </v-layout>
</template>

<script>
import { db, storage, FieldValue } from "~/plugins/firebase-client-init.js";
import Request from "~/plugins/requests/index.js";
import StaticMap from '~/components/static-map'


export default {
    name: "request-id",
    async asyncData({ params, store, error }) {
        if (store.getters.activeUser.uid) {

            let request = await db
                .collection("requests")
                .doc(params.id)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        return Object.assign({ id: doc.id }, doc.data());
                    } else {
                        error({
                            statusCode: 404,
                            message: "Request not found"
                        });
                    }
                });
            let repository = await db
                .collection("repositories")
                .doc(request.repository_id)
                .get()
                .then(doc => {
                    if(doc.exists){
                        return Object.assign({id:doc.id}, doc.data())
                    }
                });
            return {
                repository: repository,
                request: request
            };
        }

    },
    components: {
        StaticMap,
    },
    data() {
        return {
            request: null,
            repository: false,
            message: false
        };
    },
    mounted() {
        // console.log("Repository", this.repository);
    }
};
</script>

<style scoped>
.citation {
    font-family: 'Courier New', Courier, monospace;
}
</style>
