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

      <p>{{ organization.address }}</p>

      <v-card>
        <v-card-title
          :class="$vuetify.theme.dark ? 'primary--text text--lighten-2 secondary' : 'primary--text text--darken-2 deep-purple lighten-5'"
        >
          Repositories
        </v-card-title>
        <v-divider />
        <v-list v-if="repositories">
          <template
            v-for="(repo, index) in repositories"
          >
            <v-list-item
              :key="repo.id"
            >
              <v-list-item-content>
                <v-list-item-title>{{ repo.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ repoAddress( repo ) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  color="primary"
                  text
                  @click="makeRequestAtRepository(repo)"
                >
                  Make Request
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider v-if="index !== repositories.length - 1" :key="repo.id" />
          </template>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>No Repositories</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
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
            organization: 'organizations/getOrganization',
            repositories: 'organizations/getOrganizationRepositories'
        })
    },
    methods: {
        ...mapActions({
            getOrganization: 'organizations/getOrganization'
        }),
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
            this.$store.commit('create/setRepository', repo)
            this.$router.push({ name: 'request-create' })
        }
    }
}
</script>
