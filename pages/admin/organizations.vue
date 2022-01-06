<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <admin-menu />

      <v-card-title primary-title />

      <!-- <v-card-text>
      <ul v-for="(org, key) in organizations" :key="org.id">
        <li>
          <a @click="editOrg(key)">
            {{ org.name }}
          </a>
        </li>
      </ul>
    </v-card-text> -->

      <v-data-table :headers="tableHeaders" :items="organizations" class="">
        <template #top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Organizations</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            />
            <v-spacer />
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="newOrg()"
            >
              New Org
            </v-btn>
          </v-toolbar>
        </template>

        <template #item="{ item: org }">
          <tr>
            <td>{{ org.name }}</td>
            <td>{{ org.address }}</td>
            <td>{{ org.slug }}</td>
            <td>
              <v-icon
                small
                class="mr-2"
                @click="editOrg(org.id)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteOrg(org.id)"
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
            <span>{{ current.id ? current.name : 'New Organization' }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="current.name" label="Name" required />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.address" label="Address" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.slug" label="URL Slug" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="current.owner" label="Account Owner" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-if="current.id" style @click="deleteOrg">
              <v-icon left>
                mdi-delete
              </v-icon>Delete
            </v-btn>

            <v-btn color="primary" :loading="saving" @click="saveOrg">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { Organization } from '~/models'
export default {
    name: 'Organizations',
    middleware: 'admin-guard',
    data () {
        return {
            modal: false,
            organizations: [],
            current: null,
            saving: false,
            tableHeaders: [
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Address',
                    value: 'address'
                },
                {
                    text: 'URL Slug',
                    value: 'slug'
                },
                {
                    text: 'Options',
                    value: 'slug'
                }
            ]
        }
    },
    async fetch () {
        await this.$fire.firestore.collection('organization').get().then((docs) => {
            if (!docs.empty) {
                docs.forEach((doc) => {
                    this.organizations.push(Organization.fromSnapshot(doc))
                })
            }
        })
    },
    mounted () {},
    methods: {
        select (id) {
            // Select the current/chosen organization to edit
            this.current = this.organizations.find(org => org.id === id)
        },
        refresh () {
            this.organizations = []
            this.$fetch()
        },
        editOrg (id) {
            this.select(id)
            // Show the editor
            this.modal = true
        },
        saveOrg () {
            this.saving = true
            this.current.save()
                .then((ref) => {
                    this.organizations.unshift(this.current)
                    this.$toast.success('Saved!')
                }).catch((error) => {
                    this.$toast.error(error)
                }).finally(() => {
                    this.saving = false
                    this.modal = false
                })
            console.log(this.current)
        },
        deleteOrg (id) {
            this.select(id)
            if (confirm('Are you sure you want to delete this Organization?')) {
                this.current.delete()
                    .then(() => {
                        this.$toast.success('Deleted')
                        this.refresh()
                    }).catch((error) => {
                        this.$toast.error(error)
                    }).finally(() => {
                        this.modal = false
                    })
            }
        },
        newOrg () {
            this.current = new Organization()
            this.modal = true
        }

    }
}
</script>

<style>

</style>
