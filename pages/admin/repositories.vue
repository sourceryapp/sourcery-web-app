<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <admin-menu />

      <v-card-title primary-title />

      <v-data-table
        :headers="tableHeaders"
        :search="search"
        :items="repositories"
        :loading="loading"
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
              @click="newRepo()"
            >
              New Repo
            </v-btn>
          </v-toolbar>
        </template>

        <template #item="{ item: repo }">
          <tr>
            <td>{{ repo.name }}</td>
            <td>
              {{ repo.address1 }}<br>
              {{ repo.address2 }}
            </td>
            <td>{{ repo.city }}</td>
            <td>{{ repo.state }}</td>
            <td>
              <v-icon
                small
                class="mr-2"
                @click="editRepo(repo.id)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteRepo(org.id)"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-dialog v-if="current" v-model="modal" max-width="600px">
        <v-card>
          <v-card-title class="text-h5" style="" primary-title>
            <span>{{ current.id ? current.name : 'New Repository' }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="current.name" label="Repository/Archive Name" required />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.institution" label="Institution Name" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.address1" label="Address" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.address2" label="Address Line 2" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.city" label="City" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.state" label="State/Province" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.postal_code" label="Postal Code" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.country" label="Country Code" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.latitude" label="Latitude" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.longitude" label="Longitude" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-if="current.id" style @click="deleteRepo()">
              <v-icon left>
                mdi-delete
              </v-icon>Delete
            </v-btn>

            <v-btn color="primary" :loading="saving" @click="saveRepo()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- <v-card-text>
      <ul v-for="repo in repositories" :key="repo.id">
        <li>{{ repo.name }}</li>
      </ul>
    </v-card-text> -->
    </v-flex>
  </v-layout>
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
            current: null,
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
            search: '',
            modal: false,
            loading: true,
            saving: false
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
        this.loading = false
    },
    mounted () {},
    methods: {
        select (id) {
            // Select the current/chosen repository to edit
            this.current = this.repositories.find(repo => repo.id === id)
        },
        editRepo (id) {
            this.select(id)
            // Show the editor
            this.modal = true
        },
        newRepo () {
            this.current = new Repository()
            this.modal = true
        }

    }
}
</script>

<style>

</style>
