<template>
  <div id="content" class="site-content">
    <admin-menu />

    <v-card-title primary-title />

    <v-data-table
      :headers="tableHeaders"
      :search="search"
      :items="repositories"
      class=""
      multi-sort
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Repositories</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search by Name"
            single-line
            hide-details
          />
          <v-spacer />
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="newOrg()"
          >
            New Repo
          </v-btn>
        </v-toolbar>
      </template>

      <template #item="{ item: repo }">
        <tr>
          <td>{{ repo.name }}</td>
          <td>{{ repo.address1 }}</td>
          <td>{{ repo.city }}</td>
          <td>{{ repo.state }}</td>
          <td>
            <v-icon
              small
              class="mr-2"
              @click="editOrg(repo.id)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleterepo(org.id)"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    <!-- <v-card-text>
      <ul v-for="repo in repositories" :key="repo.id">
        <li>{{ repo.name }}</li>
      </ul>
    </v-card-text> -->
  </div>
</template>

<script>
import { Repository } from '~/models'
export default {
    name: 'Repositories',
    layout: 'admin',
    middleware: 'admin-guard',
    data () {
        return {
            repositories: [],
            tableHeaders: [
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Address',
                    value: 'address1'
                },
                {
                    text: 'City',
                    value: 'city'
                },
                {
                    text: 'State',
                    value: 'state'
                },
                {
                    text: 'Options'
                }
            ],
            search: ''
        }
    },
    async fetch () {
        await this.$fire.firestore.collection('repositories').get().then((docs) => {
            if (!docs.empty) {
                docs.forEach((doc) => {
                    this.repositories.push(Repository.fromSnapshot(doc))
                })
            }
        })
    },
    mounted () {},
    methods: {

    }
}
</script>

<style>

</style>
