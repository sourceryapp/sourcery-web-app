<template>
  <v-tabs optional left>
    <template v-for="(link, index) in links">
      <v-tab :key="index" :to="link.href">
        {{ link.text }}
      </v-tab>
    </template>
  </v-tabs>
</template>

<script>
export default {
    name: 'AdminMenu',
    // props: {
    //     alt: {
    //         type: String,
    //         required: false,
    //         default: ''
    //     },
    //     repository: {
    //         type: Object,
    //         required: true
    //     }
    // },
    data () {
        return {
            links: [
                {
                    href: '/admin/organizations',
                    text: 'Organizations'
                },
                {
                    href: '/admin/repositories',
                    text: 'Repositories'
                }
                // {
                //     href: '/admin/requests',
                //     text: 'Requests'
                // },
                // {
                //     href: '/admin/users',
                //     text: 'Users'
                // }
            ]
        }
    }
}
</script>

<style scoped>

</style>
