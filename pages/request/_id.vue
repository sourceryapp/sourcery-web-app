<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 v-if="request !== null">
      <h1>{{request.label}}</h1>
      <StaticMap
        :alt="`Satellite image of ${repository.name}`"
        :lat="repository.geo._lat"
        :long="repository.geo._long"
        ></StaticMap>
      <p>Citation:</p>
      <p class="mb-2">{{request.citation}}</p>
      <p>
        Repository:
        <strong>{{repository}}</strong> [

      </p>
      <p>
        Status:
        <strong>{{request.status}}</strong>
      </p>

      <div v-if="request.status === 'completed'">
        <h1>Images:</h1>
        <ul>
          <li v-for="(image, index) in request.attachments" :key="index">
            <img :src="image.file" :alt="`Request Result ${index}`">
          </li>
        </ul>
      </div>
      <p class="text-xs-center">
        <v-btn color="primary" to="/">
          <v-icon dark>arrow_back_ios</v-icon>Back
        </v-btn>
        <v-btn color="primary" to="/">Edit</v-btn>
        <v-btn color="primary" @click="message=true">Delete?</v-btn>
      </p>
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
import { db } from "~/plugins/firebase-client-init.js";
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
</style>
