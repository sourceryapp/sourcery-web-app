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

    <v-dialog v-if="Number.isInteger(current)" v-model="modal" max-width="600px">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ organizations[current].name }}
          <v-btn flat icon @click="deleteOrg">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="organizations[current].name" label="Name" required />
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="organizations[current].address" label="Address" />
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="organizations[current].owner" label="Account Owner" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="modal = false">
            Close
          </v-btn>
          <v-btn color="primary" :loading="saving" @click="saveOrg">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Organization } from '~/models'
export default {
    name: 'Organizations',
    middleware: 'admin-guard',
    layout: 'admin',
    async fetch () {
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
            saving: false
        }
    },
    mounted () {},
    methods: {
        editOrg (key) {
            // Select the current/chosen organization to edit
            this.current = Number(key)

            // Show the editor
            this.modal = true
        },
        saveOrg () {
            this.saving = true
            this.organizations[this.current].save()
                .then(() => {
                    this.$toast.success('Saved!')
                }).catch((error) => {
                    this.$toast.error(error)
                }).finally(() => {
                    this.saving = false
                })
        },
        deleteOrg () {
            if (confirm('Are you sure you want to delete this Organization?')) {

            }
        }

    }
}
</script>

<style>

</style>
