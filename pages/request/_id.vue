<template>
  <v-layout>

    <v-flex xs12 sm8 offset-sm2>
      <h1></h1>
        <v-alert type="error" :value="!record">
        That request could not be found.
        </v-alert>
        <template v-if="record.exists">
            <v-card>
                <StaticMap
                    :alt="`Satellite image of ${record.data().repository.name}`"
                    :repository="record.data().repository"
                    ></StaticMap>
                <v-card-title>
                    <div>
                        <div class="headline">{{record.data().label}}</div>

                        <span class="grey--text text--darken-4 citation">{{record.data().citation}}</span>

                        <v-divider class="mt-3 mb-3"></v-divider>

                        <div class="" style="text-transform:capitalize"><strong>Status</strong>: {{record.request().prettyStatus()}}</div>
                        <div class=""><strong>Repository</strong>: {{record.data().repository.institution}}</div>
                    </div>
                </v-card-title>
                <v-card-actions>
                <!-- <v-btn color="primary" v-if="record.request().isPending()" to="/">Edit</v-btn> -->
                <v-btn color="primary" v-if="record.request().isPending()" @click="message=true">Cancel</v-btn>
                <v-btn color="primary" v-if="record.request().isComplete() && !record.request().isArchived()" @click="archive">Archive</v-btn>
                <!-- <v-btn color="primary" to="/" v-if="record.status=='complete'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
                </v-card-actions>
            </v-card>

            <v-card v-if="record.request().isComplete()" class="mt-3">
                <v-card-title>
                    <div>
                        <div class="headline">Download Images</div>

                        <div><span class="grey--text text--darken-4">Click/Touch each image to download.</span></div>
                    </div>
                </v-card-title>
                <v-layout row wrap>
                <v-flex xs3 v-for="(image, index) in record.data().attachments" :key="index" class="pa-2">
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
        </template>
    </v-flex>
  </v-layout>
</template>

<script>
import { db, storage, FieldValue } from "~/plugins/firebase-client-init.js";
import StaticMap from '~/components/static-map'


export default {
    name: "request-id",
    async asyncData({ params, store, error }) {
        if (store.getters.activeUser.uid) {
            return db.collection("requests").doc(params.id).get()
            .then(doc => {
                return {
                    record: (doc.exists) ? doc : false
                }
            })
            .catch((e) => {
                console.log(e)
            })
        }

    },
    components: {
        StaticMap,
    },
    data() {
        return {
            record: false,
            message: false
        };
    },
    methods: {
        archive: async function(){
            if( confirm('Are you sure you want to archive this item? This action cannot be undone.') ) {
                this.record.request().markArchived();
            }else{
                return false;
            }
        }
    },
    mounted() {
        //  Listen for changes to this document
        db.collection("requests").doc(this.record.id).onSnapshot( doc => { this.record = doc });
    }
};
</script>

<style scoped>
.citation {
    font-family: 'Courier New', Courier, monospace;
}
</style>
