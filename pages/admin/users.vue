<template>
  <div id="content" class="site-content">
    <admin-menu />

    <v-card-title primary-title>
      <h3>Manage Users</h3>
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
    layout: 'admin',
    middleware: 'admin-guard',
    data () {
        return {
            organizations: []
        }
    },
    fetch () {
        this.$fire.firestore.collection('organization').get().then((docs) => {
            if (!docs.empty) {
                docs.forEach((doc) => {
                    this.organizations.push(new Organization(doc))
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
