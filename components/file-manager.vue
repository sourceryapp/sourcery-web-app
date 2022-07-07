<template>
  <v-container>
    <v-row>
      <v-col class="d-flex child-flex" cols="12" md="9">
        <span :class="titleClass">{{ title }}</span>
      </v-col>
      <v-col class="d-flex child-flex" cols="12" md="3">
        <!-- File Upload -->
        <file-input
          multiple
          accept="image/*,.pdf"
          text="Upload File"
          icon="mdi-cloud-upload"
          @change="updateFileList"
        />
      </v-col>
      <!-- Camera Upload/Control WIP -->

      <!-- <v-col class="d-flex child-flex" cols="12" md="3">
        <file-input
          multiple
          accept="image/*,.pdf"
          text="Take Photo"
          icon="mdi-camera"
          capture="environment"
          @change="updateFileList"
        />
      </v-col> -->
    </v-row>
    <!-- Active Uploads -->
    <v-row>
      <v-col cols="12">
        <file-queue :id="id" />
      </v-col>
    </v-row>
    <v-row>
      <!-- Existing Files -->
      <template v-if="request && request.attachments">
        <v-col v-for="attachment in request.attachments" :key="attachment.id" :class="colClasses" :cols="colCount">
          <file :attachment="attachment" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'FileManager',
    props: {
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: false,
            default: 'Uploads'
        },
        titleClass: {
            type: String,
            require: false,
            default: 'text-h6'
        }
    },
    data () {
        return {
            colCount: 4,
            colClasses: 'd-flex child-flex',
            fileList: []
        }
    },
    async fetch () {
        // Populate the store and local var request
        await this.getById(this.id)
    },
    computed: {
        request () {
            return this.$store.state.supabaseRequest.request
        },
        items () {
            return this.$store.state.fileList.files
        }
    },
    mounted () {
        console.log(this.request)
    },
    methods: {
        ...mapActions({
            getById: 'supabaseRequest/getById',
            addAttachment: 'supabaseRequest/addAttachment',
            deleteAttachment: 'supabaseRequest/deleteAttachment',
            complete: 'supabaseRequest/complete',
            addAll: 'fileList/addAll'
        }),
        updateFileList (fileList) {
            console.info('file list updated')
            this.addAll(fileList)
        },
        getLocalUrl (file) {
            return URL.createObjectURL(file)
        }

    }
}
</script>

<style scoped>
input[type=file]{
    position: absolute;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      outline: none;
      opacity: 0;
}
</style>
