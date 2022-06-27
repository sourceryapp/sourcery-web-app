<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-img :src="getImagePreview(file)" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-html="file.name" />
      <!-- <v-list-item-subtitle v-html="file.lastModifiedDate" /> -->
      <v-progress-linear color="primary" height="10" indeterminate striped />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
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
        this.$store.dispatch('supabaseRequest/addAttachment', this.file).then(() => {
            this.$emit('success')
        }).catch((error) => {
            this.$emit('failure', error)
        })
    },
    methods: {
        getImagePreview (file) {
            return URL.createObjectURL(file)
        }

    }
}
</script>

<style scoped>

</style>
