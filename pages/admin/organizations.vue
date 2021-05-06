<template>
  <div id="content" class="site-content">
    <v-card-title primary-title>
      <h3>Manage Organizations</h3>
    </v-card-title>

    <v-card-text>
      <ul v-for="(org, key) in organizations" :key="org.id">
        <li>
          <a @click="editOrg(key)">
            {{ org.name }}
          </a>
        </li>
      </ul>
    </v-card-text>

    <v-data-table :headers="tableHeaders" :items="organizations" class="">
      <template v-slot:items="props">
        <td>
          <a @click="editOrg(props.index)">{{ props.item.name }} {{ props.index }}</a>
        </td>
        <td>
          {{ props.item.address }}
        </td>
        <td>
          {{ props.item.owner }}
        </td>
      </template>
    </v-data-table>

    <v-dialog v-if="current" v-model="modal" max-width="600px">
      <v-card>
        <v-card-title class="headline grey lighten-2" style="" primary-title>
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
                <v-text-field v-model="current.owner" label="Account Owner" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="current.id" style @click="deleteOrg">
            <v-icon left>
              delete
            </v-icon>Delete
          </v-btn>

          <v-btn color="primary" :loading="saving" @click="saveOrg">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      color="primary"
      absolute
      bottom
      right
      fab
      @click="newOrg()"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { Organization } from '~/models'
export default {
    name: 'Organizations',
    middleware: 'admin-guard',
    layout: 'admin',
    async fetch () {
        this.organizations = []
        await this.$fire.firestore.collection('organization').get().then((docs) => {
            if (!docs.empty) {
                docs.forEach((doc) => {
                    this.organizations.push(new Organization(doc))
                })
            }
        })
    },
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
                    text: 'Owner ID',
                    value: 'ownder'
                }
            ]
        }
    },
    mounted () {},
    methods: {
        refresh () {
            this.organizations = []
            this.$fetch()
        },
        editOrg (key) {
            // Select the current/chosen organization to edit
            this.current = this.organizations[Number(key)]

            // Show the editor
            this.modal = true
        },
        saveOrg () {
            this.saving = true
            this.current.save()
                .then((ref) => {
                    this.$toast.success('Saved!')
                    if (ref) {
                        // It's a new doc, so refresh the list
                        this.refresh()
                    }
                }).catch((error) => {
                    this.$toast.error(error)
                }).finally(() => {
                    this.saving = false
                    this.modal = false
                })
        },
        deleteOrg () {
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
            const docRef = this.$fire.firestore.collection('organization').doc()
            this.current = new Organization(docRef)
            this.modal = true
        }

    }
}
</script>

<style>

</style>
