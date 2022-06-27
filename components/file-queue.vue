<template>
  <!-- Active Uploads -->

  <v-list v-if="items.length !== 0" three-line>
    <div v-for="(item, index) in items" :key="index">
      <v-divider />
      <file-uploader :file="item" @success="uploadCompleted(index)" @failure="uploadFailed" />
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
        console.warn('Items', this.items)
    },
    methods: {
        ...mapMutations({
            removeFileFromQueue: 'fileList/remove'
        }),
        uploadCompleted (i) {
            console.log('upload complete!', i)
            this.removeFileFromQueue(i)
        },
        uploadFailed (error) {
            console.log(error)
        }
    }
}
</script>

<style scoped>

</style>
