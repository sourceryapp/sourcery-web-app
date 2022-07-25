<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-img :src="getImagePreview(file)" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="font-weight-medium" v-html="file.name" />
      <span class="font-italic">{{ status }}</span>
      <!-- <v-list-item-subtitle v-html="file.lastModifiedDate" /> -->
      <v-progress-linear color="primary" height="10" indeterminate striped />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
// import { Image } from 'image-js'
import { mapActions } from 'vuex'
export default {
    name: 'FileUploader',
    props: {
        // https://developer.mozilla.org/en-US/docs/Web/API/File
        file: {
            type: File,
            required: true
        }
    },
    data () {
        return {
            status: ''
        }
    },
    async fetch () {
    },
    computed: {
        ...mapActions({
            addAttachment: 'supabaseRequest/addAttachment'
        })
    },
    mounted () {
        /**
         * If it's a TIFF, we need to convert it
         */
        if (this.isTIFF()) {
            this.convertTiff()
                .then(imageObject => imageObject.toBase64())
                .then((encoded) => {
                    console.log(encoded)
                    // this.uploadFile(encoded)
                }).catch((error) => {
                    console.error('There was a problem converting this TIFF', error)
                })
        } else {
            this.uploadFile()
        }
    },
    methods: {
        getImagePreview (file) {
            console.log(file)
            const thumbnails = {
                'image/tiff': '/img/tiff.svg',
                'application/pdf': '/img/pdf.svg'
            }
            if (Object.prototype.hasOwnProperty.call(thumbnails, file.type)) {
                return thumbnails[file.type]
            } else {
                return URL.createObjectURL(file)
            }
        },
        // convertTiff () {
        //     this.status = 'Converting...'
        //     return this.file.arrayBuffer()
        //         .then(buffer => Image.load(buffer))
        //         .catch((error) => {
        //             console.error('There was a problem loading your TIFF', error)
        //         })
        // },
        uploadFile (encoded = null) {
            this.status = 'Uploading...'
            this.$store.dispatch('supabaseRequest/addAttachment', this.file, encoded).then(() => {
                this.$emit('success')
            }).catch((error) => {
                this.$emit('failure', error)
            })
        },
        isPDF () {
            return this.file.type === 'application/pdf'
        },
        isJPEG () {
            return this.file.type === 'image/jpg'
        },
        isTIFF () {
            return this.file.type === 'image/tiff'
        }

    }
}
</script>

<style scoped>

</style>
