<template>
  <div>
    <div v-if="request !== null">
      <h1>{{request.label}}</h1>
      <v-img
        src="https://via.placeholder.com/250x100?text=Google+Map?"
        class="grey lighten-2"
      ></v-img>
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
    </div>
  </div>
</template>

<script>
import { db } from "~/plugins/firebase-client-init.js";

export default {
    name: "job-id",
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
