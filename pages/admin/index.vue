<template>
  <div id="content" class="site-content">
    <v-card-title primary-title>
      <h3>admin page</h3>
    </v-card-title>

    <v-card-text />
  </div>
</template>

<script>
export default {
    name: 'Admin',
    middleware: 'admin-guard',
    layout: 'admin',
    fetch () {
        this.organizations = [1, 3, 4]
    },
    data () {
        return {
            organizations: []
        }
    },
    mounted () {
        console.log(this.organizations)
    },
    methods: {

    }
}
</script>

<style>

</style>
