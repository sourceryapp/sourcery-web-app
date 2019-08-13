<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 v-if="record !== null">
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
          <!-- <v-btn color="primary" to="/">Edit</v-btn>
          <v-btn color="primary" @click="message=true">Delete</v-btn> -->
          <!-- <v-btn color="primary" to="/" v-if="record.request().isComplete()'"><v-icon left>cloud_download</v-icon>Download</v-btn> -->
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





        <v-card v-if="record.request().isPickedUp()" class=mt-3>
            <v-card-title primary-title class="headline">Images</v-card-title>
            <v-card-text  v-if="!record.request().isComplete()">
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
                <v-layout row wrap v-if="record.data().attachments.length">
                    <v-flex
                    v-for="n in record.data().attachments.slice().reverse()"
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
                                        <v-list-tile @click="deleteUpload(n)"  v-if="record.request().isComplete()">
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

        <template  v-if="record.request().isComplete() || record.request().isArchived()">
            <v-card class="mt-3">
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
        </template>


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

        <v-btn color="primary" @click="completeJob" v-if="record.request().isPickedUp() && record.data().attachments.length">All Done?</v-btn>

        </v-layout>
    </v-flex>

  </v-layout>
</template>

<script>
import { db, storage, FieldValue } from "~/plugins/firebase-client-init.js";
// import Mail from "~/modules/message.js";
import StaticMap from '~/components/static-map'
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
    name: "job-id",
    async asyncData({ params, store, error }) {
        if (store.getters['auth/activeUser'].uid) {
            return {
                record: await db
                .collection("requests")
                .doc(params.id)
                .get()
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

        let storageRef = storage.ref(`jobs/${this.record.id}/images/`);
        this.currentStatus = STATUS_SAVING;
        let files = this.$refs.upload.files;
        let uploaded = this.uploadedFiles;

        for (var i = 0; i < files.length; i++) {

            let file = files[i]
            let imageRef = storageRef.child(file.name);
            let uploadTask = imageRef.put(file);
            let request = this.record.id;

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
            let index = this.record.data().attachments.indexOf(image);

            // Remove the attachment from the array
            this.record.data().attachments.splice(index,1)

            // Save the new array of images
            db.collection('requests').doc(this.record.id).update({
                attachments: this.record.data().attachments
            });
        }
      },
        /**
         * Marks job as complete in firestore.
         * Reloads page to refresh the interface.
         */
        completeJob: async function(){
            if(confirm("Mark this job complete and send document(s) to the client?")){
                this.record.request().markComplete()
            }
        },
    },
    data() {
        return {
            record: null,
            message: false,
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'photos',
            currentImage: null,
            uploadDialog: false
        };
    },
    created: function(){
        // Listen for updates
        let request = this.record;
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
            if(!this.record.request().isComplete()) this.resetUploadForm();
        })

        //  Listen for changes to this document
        if(this.record && this.record.id){
            db.collection("requests").doc(this.record.id).onSnapshot( doc => { this.record = doc });
        }

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
