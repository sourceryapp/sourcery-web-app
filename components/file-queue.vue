<template>
  <!-- Active Uploads -->

  <v-list v-if="items.length !== 0" three-line>
    <div v-for="item in items" :key="item.key">
      <template v-if="item.active">
        <v-divider />
        <file-uploader :file="item.value" @success="uploadCompleted(item.key)" @failure="uploadFailed" />
      </template>
    </div>
  </v-list>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'FileQueue',
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            uploaded: false
        }
    },
    async fetch () {
    },
    computed: {
        items () {
            return this.$store.state.fileList.files
        }

    },
    mounted () {
    },
    methods: {
        ...mapMutations({
            removeFileFromQueue: 'fileList/remove'
        }),
        uploadCompleted (key) {
            console.log('upload complete!', key)
            this.removeFileFromQueue(key)
        },
        uploadFailed (error) {
            console.log(error)
        }
    }
}
</script>

<style scoped>

</style>
