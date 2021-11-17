<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <sourcery-nav-drawer :drawer="drawer " />
      <v-app-bar
        :src="repositories[0] ? `/img/repo/${repositories[0].id}.jpg` : ''"
        app
        dark
        elevate-on-scroll
        :height="repositories[0] ? '360px' : '240px'"
        class="pa-0"
      >
        <template #img="{ props }">
          <v-img
            v-bind="props"
            :gradient="repositories[0] ? '0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%' : '0deg, rgba(146, 79, 190, 1) 0%, rgba(111, 77, 170, 1) 50%'"
          />
        </template>
        <v-container class="d-flex px-0" fill-height justify-center>
          <v-row class="align-self-start" align="center" style="height: 76px; filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25)) drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.1));">
            <v-app-bar-nav-icon
              v-if="user"
              color="white"
              class="float-left"
              @click="drawer !== null ? drawer = !drawer : drawer = $vuetify.breakpoint.mobile"
            />
            <v-spacer />
            <v-app-bar-title :class="user ? 'mt-2 ma-0 ml-n8 mr-4' : 'mt-2 ma-0 mr-4'">
              <nuxt-link id="wordmark-link" to="/dashboard">
                <img
                  id="logo"
                  src="/img/sourcery-wordmark-white.svg"
                  alt="Sourcery Logo"
                >
              </nuxt-link>
            </v-app-bar-title>
            <v-spacer />
          </v-row>
          <v-row class="align-self-end" align="center">
            <v-col>
              <h1
                v-if="organization"
                class="mb-2 text-h3 text-center font-weight-bold"
                style="text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25), 0px 8px 24px rgba(0, 0, 0, 0.1);"
              >
                {{ organization.name }}
              </h1>

              <h1
                v-else
              >
                Invalid Organization
              </h1>

              <p
                class="text-h5 text-center"
                style="text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25), 0px 8px 24px rgba(0, 0, 0, 0.1);"
              >
                {{ organization.address }}
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>
      <sourcery-card title="Repositories" class="mt-4">
        <v-list
          v-if="repositories"
          color="transparent"
          class="mt-2 mx-2"
        >
          <template
            v-for="(repo, index) in repositories"
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

            <v-divider v-if="index !== repositories.length - 1" :key="repo.id" class="my-2" />
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
import { mapGetters, mapActions } from 'vuex'
import SourceryCard from '~/components/card-with-header.vue'
import NavigationDrawer from '~/components/nav-drawer.vue'

export default {
    name: 'Organization',
    components: {
        'sourcery-nav-drawer': NavigationDrawer,
        'sourcery-card': SourceryCard
    },
    layout: 'app-no-nav-drawer',
    data: () => ({
        drawer: null

    }),
    async fetch () {
        await this.getOrganization(this.$route.params.id)
    },
    computed: {
        ...mapGetters({
            organization: 'organizations/getOrganization',
            repositories: 'organizations/getOrganizationRepositories',
            user: 'auth/activeUser'
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
<style scoped>
.container {
  max-width: 100vw;
}
</style>
