<template>
  <v-app>
    <!-- Yes, this looks like shit. Waiting on new layouts. Just making it work for now. -->

    <div class="flex">
      <nav>
        <v-list>
          <v-subheader>Manage Sourcery</v-subheader>
          <template v-for="item in navigation">
            <v-list-tile :key="item.name" nuxt :to="item.path">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.name }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </nav>
      <main>
        <v-card flat>
          <nuxt />
        </v-card>
      </main>
    </div>
  </v-app>
</template>

<script>
export default {
    data () {
        return {
            navigation: [
                {
                    name: 'Organizations',
                    path: '/admin/organizations'
                },
                {
                    name: 'Requests',
                    path: '/admin/requests'
                },
                {
                    name: 'Repositories',
                    path: '/admin/repositories'
                },
                {
                    name: 'Users',
                    path: '/admin/users'
                }
            ]
        }
    },
    computed: {
        user () {
            return this.$store.getters['auth/activeUser']
        }
    }
}
</script>

<style>

.flex {
    display: flex;
    gap: 20px
}

main {
    flex-grow: 1;
}
</style>
