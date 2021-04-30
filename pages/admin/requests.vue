<template>
  <div id="content" class="site-content">
    <v-card-title primary-title>
      <h3>Manage Requests</h3>
    </v-card-title>

    <v-card-text>
      <ul v-for="org in organizations" :key="org.id">
        <li>{{ org.name }}</li>
      </ul>
    </v-card-text>
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
            organizations: []
        }
    },
    mounted () {},
    methods: {

    }
}
</script>

<style>

</style>
