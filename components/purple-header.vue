<template>
  <header>
    <div class="nav-bar d-flex justify-space-between align-center">
      <NuxtLink id="wordmark-link" to="/">
        <img id="logo" src="/img/logo-wordmark-beta-white.svg" alt="Sourcery Logo">
      </NuxtLink>
      <div class="d-flex">
        <v-btn
          text
          color="white"
          large
          to="/about"
          min-width="96px"
        >
          About
        </v-btn>
        <v-btn
          text
          color="white"
          class="ml-6"
          large
          min-width="96px"
          to="/team"
        >
          Team
        </v-btn>
        <v-btn
          outlined
          color="white"
          class="ml-6"
          min-width="96px"
          large
          to="/dashboard"
        >
          {{ user ? 'Dashboard' : 'Login' }}
        </v-btn>
      </div>
    </div>
    <!-- <h1 class="text-center white--text text-h3 font-weight-medium">
      {{ text }}
    </h1> -->
  </header>
</template>

<script>
export default {
    name: 'Header',
    props: {
        text: {
            type: String,
            required: false
        }

    },

    data () {
        return {
        }
    },

    computed: {
        user () {
            return this.$fire.auth.currentUser
        }
    }
}
</script>

<style scoped>
header {
    padding: 32px 72px;
    background: rgb(146, 79, 190);
    background: linear-gradient(
        135deg,
        rgba(146, 79, 190, 1) 0%,
        rgba(111, 77, 170, 1) 50%
    );
}
.nav-bar {
    width: 100%
}

h1 {
    margin-top: 64px;
    margin-bottom: 64px;
}
</style>
