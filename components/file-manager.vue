<template>
  <v-layout>
    <v-row>
      <v-col class="d-flex child-flex" cols="4">
        <file-input />
      </v-col>
      <template v-if="request && request.attachments">
        <v-col v-for="record in request.attachments" :key="record.id" class="d-flex child-flex" cols="4">
          <file :file="record" />
        </v-col>
      </template>
    </v-row>
  </v-layout>
</template>

<script>
import { Request } from '~/models/Request'

export default {
    name: 'FileManager',
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            request: null
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
