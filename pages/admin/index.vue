<template>
  <div id="content" class="site-content">
    admin page
  </div>
</template>

<script>
export default {
    name: 'Admin',
    middleware: 'admin-guard',
    data () {
        return {
            // social: social
        }
    },
    mounted () {},
    methods: {

    }
}
</script>

<style>

</style>
