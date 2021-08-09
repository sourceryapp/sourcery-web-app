<template>
  <ul>
    <li v-for="(link, index) in links" :key="index">
      <NuxtLink :to="link.href">
        {{ link.text }}
      </NuxtLink>
    </li>
  </ul>
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
                },
                {
                    href: '/admin/requests',
                    text: 'Requests'
                },
                {
                    href: '/admin/users',
                    text: 'Users'
                }
            ]
        }
    }
}
</script>

<style scoped>
ul {
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    padding:0;
}
</style>
