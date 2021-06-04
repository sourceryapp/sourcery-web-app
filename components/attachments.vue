<template>
  <div>
    <v-card v-if="isPickedUp && userIsVendor" class="mt-3">
      <v-card-title primary-title class="text-h5">
        Attachments
      </v-card-title>
      <v-card-text v-if="isComplete == false">
        <v-form ref="uploadForm" enctype="multipart/form-data" novalidate @submit.prevent="save()">
          <div class="dropbox">
            <input
              ref="upload"
              type="file"
              multiple
              :name="uploadFieldName"
              :disabled="isSaving"
              accept="image/*, application/pdf"
              class="input-file"
              @change="fileCount = $event.target.files.length;"
            >
            <v-btn type="submit" :loading="isSaving" :disabled="isSaving || (fileCount ===0)" color="primary">
              Upload
            </v-btn>
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
        <v-layout v-if="Array.isArray(data.attachments)" wrap>
          <v-flex
            v-for="n in data.attachments.reverse()"
            :key="n"
            xs4
            d-flex
          >
            <v-card flat tile class="d-flex">
              <figure>
                <template v-if="n.isPDF()">
                  <v-img
                    src="/img/pdf.svg"
                    aspect-ratio="1"
                    class="grey lighten-3"
                    contain
                  >
                    <v-layout
                      slot="placeholder"
                      fill-height
                      align-center
                      justify-center
                      ma0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-layout>
                  </v-img>
                </template>

                <template v-else>
                  <v-img
                    :src="n"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <v-layout
                      slot="placeholder"
                      fill-height
                      align-center
                      justify-center
                      ma0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-layout>
                  </v-img>
                </template>

                <!-- <v-layout
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
                                            <v-list-tile @click="deleteUpload(n)"  v-if="isComplete == false">
                                                <v-list-tile-title>Delete</v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-menu>

                                </v-layout> -->

                <!-- </v-img> -->
                <figcaption class="group pa-2 grey mb-3">
                  <v-layout justify-space-around>
                    <v-icon dark @click="viewUpload(n)">
                      mdi-magnify
                    </v-icon>
                    <v-icon dark @click="deleteUpload(n)">
                      mdi-delete
                    </v-icon>
                  </v-layout>
                </figcaption>
              </figure>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>

    <template v-if="isComplete || isArchived">
      <v-card class="mt-3">
        <v-card-title>
          <div>
            <div class="text-h5">
              Download Images
            </div>

            <div><span class="grey--text text--darken-4">Click/Touch each image to download.</span></div>
          </div>
        </v-card-title>
        <v-layout wrap>
          <v-flex v-for="(attachment, index) in data.attachments" :key="index" xs3 class="pa-2">
            <a :href="attachment + '&response-content-disposition=attachment; filename=something.jpg'" target="_blank" download>
              <v-img :src="!attachment.isPDF() ? attachment : '/img/pdf.svg'" :alt="`Attachment #${index+1}`" aspect-ratio="1" />
            </a>
          </v-flex>
        </v-layout>
      </v-card>
    </template>

    <!-- Viewer -->
    <v-layout justify-center>
      <v-dialog
        v-model="viewerDialog"
        fullscreen
        :scrollable="false"
      >
        <v-card>
          <v-img
            v-if="!currentImage.isPDF()"
            :src="currentImage"
            :contain="true"
            max-height="90vh"
          />

          <iframe v-else :src="currentImage" type="application/pdf" width="100%" style="height:90vh" />

          <v-spacer />

          <v-card-actions>
            <v-layout
              justify-center
            >
              <v-btn
                color="primary"
                align="center"
                @click="viewerDialog = false"
              >
                Close
              </v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn v-if="isPickedUp && data.attachments && data.attachments.length" color="primary" @click="completeJob">
        All Done?
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const STATUS_INITIAL = 0; const STATUS_SAVING = 1; const STATUS_SUCCESS = 2; const STATUS_FAILED = 3

/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
String.prototype.isPDF = function () {
    return this.includes('.pdf')
}

export default {
    name: 'Attachments',
    data () {
        return {
            message: false,
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'photos',
            currentImage: '',
            viewerDialog: false,
            fileCount: 0,
            repositories_owned: []
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
        }),
        // ...mapActions({
        //     addAttachment: 'request/addAttachment',
        // }),
        isInitial () {
            return this.currentStatus === STATUS_INITIAL
        },
        isSaving () {
            return this.currentStatus === STATUS_SAVING
        },
        isSuccess () {
            return this.currentStatus === STATUS_SUCCESS
        },
        isFailed () {
            return this.currentStatus === STATUS_FAILED
        },
        /**
         * Returns true if the current user is the vendor for this request
         */
        userIsVendor () {
            return this.repositories_owned.includes(this.data.repository_id)
            // return this.$store.state.auth.authUser.uid === this.data.vendor_id
        }
    },
    mounted () {
        this.retrieveRepositoryIdsOwned().then((data) => {
            this.repositories_owned = data
        })
    },
    methods: {
        resetUploadForm () {
            // reset form to initial state
            this.currentStatus = STATUS_INITIAL
            this.uploadedFiles = []
            this.uploadError = null
            this.fileCount = 0
            console.log(this, this.$refs)
            if (this.$refs && this.$refs.uploadForm) {
                console.log('resetting form')
                this.$refs.upload.value = ''
                this.$refs.uploadForm.reset()
            }
        },
        save () {
            // upload data to the server

            const files = this.$refs.upload.files
            console.log(files)
            // let uploaded = this.uploadedFiles;
            // let attLength = this.record.data().attachments.length;

            const promises = []
            Array.from(files).forEach((file) => {
                promises.push(this.$store.dispatch('request/addAttachment', file))
            })

            this.currentStatus = STATUS_SAVING

            Promise.all(promises).then((values) => {
                this.resetUploadForm()
                this.currentStatus = STATUS_SUCCESS
            })
        },
        viewUpload (image) {
            console.log(image)
            this.currentImage = image
            this.viewerDialog = true
        },
        deleteUpload (attachment) {
            if (confirm('Are you sure you want to delete this attachment?')) {
                this.$store.dispatch('request/deleteAttachment', attachment).catch((error) => {
                    console.log(error)
                })
            }
        },
        /**
         * Marks job as complete in firestore.
         * Reloads page to refresh the interface.
         */
        completeJob () {
            if (confirm('Mark this job complete and send document(s) to the client?')) {
                this.$store.dispatch('request/markComplete').then(() => {
                    this.$router.push({ name: 'dashboard' })
                })
            }
        },

        async retrieveRepositoryIdsOwned () {
            const ids = await this.$store.dispatch('meta/getRepositoryIdsOwned')
            return ids
        }
    }
}
</script>

<style scoped>

</style>
