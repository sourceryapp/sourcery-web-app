<template>
  <!-- Active Uploads -->

  <v-list three-line>
    <div v-for="(item, index) in items" :key="index">
      <v-divider />

      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="getImagePreview(item)" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-html="item.name" />
          <!-- <v-list-item-subtitle v-html="item.lastModifiedDate" /> -->
          <v-progress-linear color="primary" height="10" value="10" striped />
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
export default {
    name: 'FileQueue',
    props: {
        id: {
            type: Number,
            required: true
        },
        items: {
            type: FileList,
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
    },
    mounted () {
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
