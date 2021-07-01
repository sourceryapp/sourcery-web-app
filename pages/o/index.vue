<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        class="mb-4"
      >
        Organizations
      </h1>

      <v-card>
        <v-list v-if="organizations">
          <template
            v-for="(org, index) in organizations"
          >
            <organization-list-item :key="org.id" :organization="org" />
            <v-divider v-if="index !== organizations.length - 1" :key="org.id + 'd'" />
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OrganizationListItem from '~/components/organization-list-item.vue'

export default {
    name: 'Organizations',
    components: {
        OrganizationListItem
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
