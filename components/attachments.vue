<template>
  <div>
    <v-card v-if="(isPickedUp || isSubmitted) && userIsVendor" class="mt-3">
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
            <p v-if="isSaving">
              Uploading {{ fileCount }} files...
            </p>
          </div>
        </v-form>
      </v-card-text>

      <v-container grid-list-sm fluid>
        <v-layout v-if="Array.isArray(request.attachments)" wrap>
          <v-flex
            v-for="n in attachmentList"
            :key="`ra-${n.id}`"
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
                    :src="n.url"
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
          <v-flex v-for="(attachment, index) in request.attachments" :key="index" xs3 class="pa-2">
            <a :href="attachment.url + '&response-content-disposition=attachment; filename=something.jpg'" target="_blank" download>
              <v-img :src="!attachment.isPDF() ? attachment.url : '/img/pdf.svg'" :alt="`Attachment #${index+1}`" aspect-ratio="1" />
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
        <v-card v-if="currentImage">
          <v-img
            v-if="!currentImage.isPDF()"
            :src="currentImage.url"
            :contain="true"
            max-height="90vh"
          />

          <iframe v-else :src="currentImage.url" type="application/pdf" width="100%" style="height:90vh" />

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

      <v-btn v-if="(isPickedUp || isSubmitted) && request.attachments && request.attachments.length" color="primary" @click="completeJob">
        All Done?
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

const STATUS_INITIAL = 0; const STATUS_SAVING = 1; const STATUS_SUCCESS = 2; const STATUS_FAILED = 3

export default {
    name: 'Attachments',
    data () {
        return {
            message: false,
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'photos',
            currentImage: null,
            viewerDialog: false,
            fileCount: 0
        }
    },
    computed: {
        ...mapGetters({
            request: 'supabaseRequest/request',
            isComplete: 'supabaseRequest/isComplete',
            isPickedUp: 'supabaseRequest/isPickedUp',
            isArchived: 'supabaseRequest/isArchived',
            isSubmitted: 'supabaseRequest/isSubmitted',
            prettyStatus: 'supabaseRequest/prettyStatus',
            userRepositories: 'supabaseAuth/userRepositories'
        }),
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
            const ids = this.userRepositories.map(x => x.id)
            return ids.includes(this.request.repository_id)
        },
        showImagePreview () {
            return this.viewerDialog && this.currentImage
        },
        attachmentList () {
            return [...this.request.attachments].reverse()
        }
    },
    methods: {
        ...mapActions({
            addAttachment: 'supabaseRequest/addAttachment',
            deleteAttachment: 'supabaseRequest/deleteAttachment',
            complete: 'supabaseRequest/complete'
        }),
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

            const promises = []
            Array.from(files).forEach((file) => {
                promises.push(this.addAttachment(file))
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
                this.deleteAttachment(attachment).catch((error) => {
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
                this.complete().then(() => {
                    this.$router.push({ name: 'dashboard' })
                })
            }
        }
    }
}
</script>

<style scoped>
input[type="file"] {
    cursor: pointer;
}
.theme--dark input[type="file"] {
    color: black;
    background-color: #efefef;
}
</style>
