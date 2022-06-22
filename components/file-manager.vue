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
    <v-row v-if="fileList.length !== 0">
      <v-col cols="12">
        <file-queue :id="id" :items="fileList" />
      </v-col>
    </v-row>
    <v-row>
      <!-- Existing Files -->
      <template v-if="request && request.attachments">
        <v-col v-for="record in request.attachments" :key="record.id" :class="colClasses" :cols="colCount">
          <file :src="record.url" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { Request } from '~/models/Request'

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
            request: null,
            fileList: []
        }
    },
    async fetch () {
        // Getting request directly to bypass store for now
        this.request = await Request.getById(this.id)
    },
    computed: {
    },
    mounted () {
        // console.log(this.request)
    },
    methods: {
        updateFileList (fileList) {
            console.log(fileList)
            this.fileList = fileList
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
