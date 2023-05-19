<template>
  <v-app id="tube">
    <v-icon>
      mdi-caret-right
    </v-icon>
    <v-app-bar
      v-if="$route.name !== 'o-id'"
      app
      :color="$vuetify.theme.dark ? '#121212' : 'white'"
      height="84px"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mobile"
        color="primary"
        class="float-left"
        @click.stop="toggleDrawer()"
      />
      <v-spacer />
      <v-app-bar-title :class="user && $vuetify.breakpoint.smAndDown ? 'mt-2 ma-0 ml-n8' : 'mt-2 ma-0'">
        <nuxt-link id="wordmark-link" to="/dashboard">
          <img id="logo" :src="$vuetify.theme.dark ? '/img/wordmark-beta-dark.svg' : '/img/wordmark-beta.svg'" class="sourcery-image-logo" alt="Sourcery Logo">
        </nuxt-link>
      </v-app-bar-title>
      <v-spacer />
    </v-app-bar>
    <sourcery-nav-drawer ref="navdrawer" />

    <v-main pa0 class="app-main">
      <v-container fill-height>
        <v-row>
          <v-col>
            <!-- <call-to-action-alert
              v-if="user && !hasPassword"
              message="In order to gain access to the full features of Sourcery, you must set a password."
              to="/settings"
              type="warning"
              action-text="Set Password."
            /> -->
          </v-col>
        </v-row>
        <v-layout
          justify-center
        >
          <nuxt />
        </v-layout>
      </v-container>
      <chat-card />
    </v-main>

    <bottom-navigation />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import NavigationDrawer from '@/components/nav-drawer.vue'
import BottomNavigation from '@/components/bottom-navigation.vue'
import ChatCard from '@/components/chat-card.vue'

export default {
    name: 'LayoutDefault',
    components: {
        'sourcery-nav-drawer': NavigationDrawer,
        BottomNavigation,
        ChatCard
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        })
    },
    mounted () {
        const theme = localStorage.getItem('dark_theme')
        if (theme) {
            if (theme === 'true') {
                this.$vuetify.theme.dark = true
            } else {
                this.$vuetify.theme.dark = false
            }
        }
    },
    methods: {
        toggleDrawer () {
            this.$nuxt.$emit('toggle-nav-drawer')
        }
    }
}
</script>

<style>
    #wordmark-link {
        display: inline-block
    }
    #wordmark {
        display:block;
        width: 200px;
        max-width: 100%;
        height: auto;
    }
    #logo {
      height: 48px
    }
    .v-dialog > .v-card > .v-card__actions {
      padding: 8px
    }

@media print {
  .app-main {
    padding-left: 40px !important;
    padding-right: 40px !important;
  }

  header {
    position: absolute !important;
  }

  html,body {
    background: white !important;
  }
}
</style>
