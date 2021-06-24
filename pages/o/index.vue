<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        class="mb-4"
      >
        Organizations
      </h1>

      <v-item-group>
        <organization-card
          v-for="org in organizations"
          :key="org.id"
          :organization="org"
        />
      </v-item-group>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OrganizationCard from '@/components/organization-card.vue'

export default {
    name: 'Organizations',
    components: {
        OrganizationCard
    },
    data: () => ({

    }),
    async fetch () {
        await this.getOrganizations()
    },
    computed: {
        ...mapGetters({
            organizations: 'organizations/getOrganizations'
        })
    },
    methods: {
        ...mapActions({
            getOrganizations: 'organizations/getOrganizations'
        })
    }
}
</script>
