<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        v-if="organization"
        class="mb-4"
      >
        {{ organization.name }}
      </h1>

      <h1
        v-else
      >
        Invalid Organization
      </h1>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Organization',
    data: () => ({}),
    async fetch () {
        await this.getOrganization(this.$route.params.id)
    },
    computed: {
        ...mapGetters({
            organization: 'organizations/getOrganization'
        })
    },
    methods: {
        ...mapActions({
            getOrganization: 'organizations/getOrganization'
        })
    }
}
</script>
