<template>
  <v-layout>
    <v-flex xs12 sm10 xl6 offset-sm1 offset-xl3>
      <h1 class="mb-4">
        Requests
      </h1>

      <search-requests :type="type" />
    </v-flex>
  </v-layout>
</template>

<script>
import SearchRequests from '~/components/search/requests.vue'

export default {
    components: {
        SearchRequests
    },
    computed: {
        type () {
            if (this.$route.query.o) {
                return 'organization'
            }
            return 'researcher'
        }
    }
}
</script>
