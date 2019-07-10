<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 v-if="request !== null">
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
          <!-- <v-btn color="primary" to="/">Edit</v-btn>
          <v-btn color="primary" @click="message=true">Delete</v-btn> -->
          <!-- <v-btn color="primary" to="/" v-if="request.status=='complete'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
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





        <v-card v-if="request.status!='complete'" class=mt-3>
            <v-card-title primary-title class="headline">Images</v-card-title>
            <v-card-text  v-if="request.status!='complete'">
                <v-form enctype="multipart/form-data" novalidate ref="uploadForm">
                    <div class="dropbox">
                    <input type="file" multiple ref="upload" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                        accept="image/*" class="input-file">
                        <p v-if="isInitial">
                        <!-- Drag your file(s) here to begin<br> or click to browse -->
                        </p>
                        <p v-if="isSaving">
                        Uploading {{ fileCount }} files...
                        </p>
                    </div>
                </v-form>
            </v-card-text>
            <v-container grid-list-sm fluid>
                <v-layout row wrap v-if="request.attachments.length">
                    <v-flex
                    v-for="n in request.attachments.slice().reverse()"
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

                            <v-layout
                                row
                                fill-height
                                justify-end
                                ma-0
                            >

                                <v-menu bottom right offset-y>
                                    <template>
                                        <v-btn fab small class="ma-0 pa-0" color="grey lighten-2" icon slot="activator">
                                            <v-icon>more_vert</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-tile @click="viewUpload(n)">
                                            <v-list-tile-title>View</v-list-tile-title>
                                        </v-list-tile>
                                        <v-list-tile @click="deleteUpload(n)"  v-if="request.status!='complete'">
                                            <v-list-tile-title>Delete</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>

                            </v-layout>

                            </v-img>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>

        <!-- Upload Dialog -->
        <v-layout row justify-center>

            <v-dialog
            v-model="uploadDialog"
            >
            <v-card>
                <v-img :src="currentImage" v-if="currentImage"></v-img>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="primary"
                    @click="uploadDialog = false"
                >
                    Close
                </v-btn>

                <!-- <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click="uploadDialog = false"
                >
                    Agree
                </v-btn> -->
                </v-card-actions>
            </v-card>
            </v-dialog>

        <v-btn color="primary" @click="completeJob" v-if="request.status!='complete'">All Done?</v-btn>

        </v-layout>
    </v-flex>

  </v-layout>
</template>

<script>
import { db, storage, FieldValue } from "~/plugins/firebase-client-init.js";
import Mail from "~/modules/message.js";
import Request from "~/plugins/requests/index.js";
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
      resetUploadForm: function () {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
        console.log(this, this.$refs);
        if(this.$refs && this.$refs.uploadForm){
            this.$refs.uploadForm.reset();
        }
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

                // @todo Handle upload error messages
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
                }, async () => {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        db.collection('requests').doc(request).update({
                            attachments: FieldValue.arrayUnion(downloadURL)
                        });
                    });
                    this.resetUploadForm();
                }
            );
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
      },
      viewUpload(image){
          this.currentImage = image;
          this.uploadDialog = true;
      },
      deleteUpload(image){
        if(confirm("Are you sure you want to delete this image?")){

            // Get the index of the attachment to delete
            let index = this.request.attachments.indexOf(image);

            // Remove the attachment from the array
            this.request.attachments.splice(index,1)

            // Save the new array of images
            db.collection('requests').doc(this.request.id).update({
                attachments: this.request.attachments
            });
        }
      },
        /**
         * Marks job as complete in firestore.
         * Reloads page to refresh the interface.
         */
        async completeJob(){
            await this.requestModel.markAsComplete(this.request.id);
            await Mail.send({
              to: 'brian.daley@uconn.edu',
              subject: 'The Job is Done!',
              text: 'Woot!',
            });
            window.location.reload();
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
            uploadFieldName: 'photos',
            currentImage: null,
            uploadDialog: false,
            requestModel: Request
        };
    },
    created: function(){
        // Listen for updates
        let request = this.request;
        db.collection("requests").doc(request.id).onSnapshot(function(doc) {
            if(doc.data().attachments.length){
                console.log(request, doc.data());
                request.attachments = doc.data().attachments;
            }
        });
    },
    mounted: function() {
        console.log('Mounted', this.$refs);
        this.$nextTick( () => {
            // Code that will run only after the
            // entire view has been rendered
            if(this.request.status!='complete') this.resetUploadForm();
        })
    }
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
