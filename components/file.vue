<template>
  <div>
    <v-img
      v-if="file"
      :src="file.url"
      aspect-ratio="1"
      class="grey lighten-2"
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey lighten-5" />
        </v-row>
      </template>
    </v-img>
  </div>
</template>

<script>

export default {
    name: 'File',
    props: {
        file: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
        }
    },
    computed: {
    },
    mounted () {
        console.log(this.file)
    }
}
</script>

<style scoped>
</style>
