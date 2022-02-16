<template>
  <header class="py-4 px-4 px-md-16">
    <div class="nav-bar d-flex justify-space-between align-center">
      <NuxtLink id="wordmark-link" to="/">
        <img id="logo" src="/img/logo-wordmark-beta-white.svg" alt="Sourcery Logo">
      </NuxtLink>
      <div class="d-none d-sm-flex">
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
          v-if="isProd"
          outlined
          color="white"
          class="ml-6"
          min-width="96px"
          large
          to="/join-us"
        >
          Sign Up
        </v-btn>
        <v-btn
          v-if="!isProd"
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
      <v-menu>
        <template #activator="{ on, attrs }">
          <v-btn
            color="white"
            icon
            v-bind="attrs"
            class="d-flex d-sm-none"
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list dense nav>
          <v-list-item
            to="/"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item
            to="/about"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
          <v-list-item
            to="/team"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Team</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="user && !isProd"
            to="/dashboard"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="!user && !isProd"
            to="/login"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isProd"
            to="/join-us"
            color="white"
          >
            <v-list-item-icon>
              <v-icon>mdi-clipboard-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Sign Up</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Header',
    props: {
    },

    data () {
        return {
        }
    },

    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        isProd () {
            if (process.env.BASE_URL && process.env.BASE_URL === 'https://sourceryapp.org') {
                return true
            }
            return false
        }
    }
}
</script>

<style scoped>
header {
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
#logo {
  height: 32px
}
</style>
