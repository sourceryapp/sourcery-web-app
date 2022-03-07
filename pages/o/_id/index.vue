<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <organization-app-bar
        :repositories="organization.repositories"
        :organization="organization"
      />
      <sourcery-card title="Repositories" class="mt-4">
        <v-list
          v-if="organization.repositories"
          color="transparent"
          class="mt-2 mx-2"
        >
          <template
            v-for="(repo, index) in organization.repositories"
          >
            <v-list-item
              :key="repo.id"
              color="transparent"
            >
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ repo.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ repoAddress( repo ) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  color="primary"
                  outlined
                  large
                  @click="makeRequestAtRepository(repo)"
                >
                  Make a request
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider v-if="index !== organization.repositories.length - 1" :key="repo.id" class="my-2" />
          </template>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>No Repositories</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
import SourceryCard from '@/components/card-with-header.vue'
import OrganizationAppBar from '@/components/organization-app-bar.vue'
import { Organization } from '~/models/Organization'

export default {
    name: 'Organization',
    components: {
        SourceryCard,
        OrganizationAppBar
    },
    async asyncData ({ params, store }) {
        const organization = await Organization.getBySlug(params.id)

        return {
            organization
        }
    },
    methods: {
        repoAddress (repo) {
            let addr = repo.address1
            if (repo.address2) {
                addr += `, ${repo.address2}`
            }
            if (repo.city) {
                addr += `, ${repo.city}`
            }
            if (repo.state) {
                addr += ` ${repo.state}`
            }
            if (repo.postal_code) {
                addr += `, ${repo.postal_code}`
            }
            if (repo.country_code) {
                addr += `, ${repo.country_code}`
            }
            return addr
        },
        makeRequestAtRepository (repo) {
            this.$store.commit('supabaseCreate/setRepository', repo)
            this.$router.push({ name: 'request-create' })
        }
    }
}
</script>
<style scoped>
.container {
  max-width: 100vw;
}
</style>
