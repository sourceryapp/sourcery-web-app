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


          <h2>Add Images:</h2>
      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <div class="dropbox">
          <input type="file" multiple ref="upload" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
            accept="image/*" class="input-file">
            <p v-if="isInitial">
              Drag your file(s) here to begin<br> or click to browse
            </p>
            <p v-if="isSaving">
              Uploading {{ fileCount }} files...
            </p>
        </div>
      </form>
        <p v-if="isSuccess">File(s) uploaded successfully!</p>


        <v-card v-if="request.attachments.length">
            <v-container grid-list-sm fluid>
                <v-layout row wrap>
                    <v-flex
                    v-for="n in request.attachments"
                    :key="n"
                    xs4
                    d-flex
                    >
                        <v-card flat tile class="d-flex">
                            <v-img
                            :src="n"
                            :lazy-src="n"
                            aspect-ratio="1"
                            class="grey lighten-2"
                            >
                            <v-layout
                                slot="placeholder"
                                fill-height
                                align-center
                                justify-center
                                ma-0
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-layout>
                            </v-img>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-flex>


  </v-layout>
</template>

<script>
import { db, storage, FieldValue } from "~/plugins/firebase-client-init.js";
import StaticMap from '~/components/static-map'
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

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
    computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      }
    },
    components: {
        StaticMap,
    },
    methods: {
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
      },
      async save(formData) {
        // upload data to the server

        let storageRef = storage.ref(`jobs/${this.request.id}/images/`);
        this.currentStatus = STATUS_SAVING;
        let files = this.$refs.upload.files;
        let uploaded = this.uploadedFiles;

        for (var i = 0; i < files.length; i++) {

            let file = files[i]
            let imageRef = storageRef.child(file.name);
            let uploadTask = imageRef.put(file);
            let request = this.request.id;

            uploadTask.on('state_changed', // or 'state_changed'
                function(snapshot) {
                    // Update progress here... if you want
                }, function(error) {

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                    case 'storage/canceled':
                    // User canceled the upload
                    break;
                    case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
                }, async function() {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        db.collection('requests').doc(request).update({
                            attachments: FieldValue.arrayUnion(downloadURL)
                        });
                    });
            });
        }
        this.currentStatus = STATUS_SUCCESS;
      },
      filesChange(fieldName, fileList) {
        // handle file changes
        const formData = new FormData();

        if (!fileList.length) return;

        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name);
          });

        // save it
        this.save(formData);
      }
    },
    data() {
        return {
            request: null,
            repository: false,
            message: false,
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'photos'
        };
    },
    created(){
        // Listen for updates
        let request = this.request;
        db.collection("requests").doc(request.id).onSnapshot(function(doc) {
            if(doc.data().attachments.length){
                console.log(request, doc.data());
                request.attachments = doc.data().attachments;
            }
        });
    },
    mounted() {
        this.reset();
    }
};
</script>

<style scoped>
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
