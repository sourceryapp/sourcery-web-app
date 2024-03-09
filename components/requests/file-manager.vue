<template>
    <v-row>
        <v-col cols="12" md="9">
            <p v-if="request.attachments.length > 0">
                Click on any attachment to edit.
            </p>
        </v-col>
        <v-col class="d-flex child-flex" cols="12" md="3">
            <!-- File Upload -->
            <!-- <file-input multiple accept=".jpeg,.jpg,.png,.pdf" text="Upload File" icon="mdi-cloud-upload" @change="updateFileList" /> -->
            File Upload
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
</template>

<script setup>
const props = defineProps(['request'])
</script>