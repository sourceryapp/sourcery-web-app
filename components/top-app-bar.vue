<template>
  <div>
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mobile"
      color="primary"
      class="float-left"
      @click.stop="toggleDrawer()"
    />
    <v-spacer />
    <v-app-bar-title :class="user && $vuetify.breakpoint.smAndDown ? 'mt-2 ma-0 ml-n8' : 'mt-2 ma-0'">
      <nuxt-link id="wordmark-link" to="/dashboard">
        <img id="logo" :src="$vuetify.theme.dark ? '/img/wordmark-beta-dark.svg' : '/img/wordmark-beta.svg'" alt="Sourcery Logo">
      </nuxt-link>
    </v-app-bar-title>
    <v-spacer />
  </div>
</template>

<script>
export default {
    methods: {
        toggleDrawer () {
            this.$nuxt.$emit('toggle-nav-drawer')
        }
    }
}
</script>
