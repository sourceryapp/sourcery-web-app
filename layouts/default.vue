<template>
  <v-app id="tube">
    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      class="primary"
      dark
      right
      app
    >
      <v-list color="red" class="pa-0" three-line>
        <v-list-tile>
          <v-list-tile-avatar size="50" class="mr-3">
            <img :src="gravatar">
          </v-list-tile-avatar>
          <v-list-tile-content v-if="user">
            <v-list-tile-title>{{ user.displayName }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
            <v-list-tile-sub-title v-if="isOrgMember">
              Institutional Account
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider />

      <v-list dense class="pt-0" two-line>
        <v-list-tile
          v-for="item in items1"
          :key="item.title"
          :to="item.link"
          nuxt
          active-class="accent accent--text text--lighten-5"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile nuxt active-class @click="dialog=true">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Log Out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="white" light fixed app>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="user"></v-toolbar-side-icon> -->

      <v-toolbar-title style="display:flex; justify-content:center; width: 100%" class="ma-0">
        <nuxt-link id="wordmark-link" to="/">
          <img id="logo" src="/img/sourcery-wordmark.svg" alt="Sourcery Logo">
        </nuxt-link>
      </v-toolbar-title>

      <!-- Stupid Hack to center align the wordmark -->
      <!-- <v-toolbar-side-icon style="visibility: hidden" v-if="user"></v-toolbar-side-icon> -->
    </v-toolbar>
    <v-content pa-0>
      <v-container fill-height>
        <v-layout
          justify-center
        >
          <nuxt />
        </v-layout>
      </v-container>
    </v-content>
    <v-bottom-nav
      v-if="user"
      :value="true"
      app
      fixed
    >
      <v-btn
        flat
        value="dashboard"
        to="/dashboard"
        color="primary"
      >
        <span>Dashboard</span>
        <v-icon>dashboard</v-icon>
      </v-btn>

      <v-btn
        flat
        value="add"
        to="/request/create"
        color="primary"
      >
        <span>New Request</span>
        <v-icon>add_circle</v-icon>
      </v-btn>

      <v-btn
        flat
        value="search"
        to="/jobs"
        color="primary"
      >
        <span>Find Jobs</span>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn
        flat
        value="settings"
        color="primary"
        active-class=""
        :class="drawer ? 'v-btn--active' :''"
        @click.stop="drawer = !drawer"
      >
        <span>Settings</span>
        <v-icon>settings</v-icon>
      </v-btn>
    </v-bottom-nav>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to log out?
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="primary"
            nuxt
            active-class
            @click="logout()"
          >
            Log Out
          </v-btn>

          <v-btn
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import md5 from 'md5'

export default {
    // props: {
    //     source: String
    // },
    data: () => ({
        drawer: null,
        dialog: false,
        items1: [
            { title: 'Edit Profile', icon: 'person', link: '/account/profile' },
            { title: 'Payment Options', icon: 'credit_card', link: '/account/credit-cards' },
            { title: 'Payouts', icon: 'account_balance', link: '/account/payouts' },
            { title: 'Notifications', icon: 'notifications', link: '/settings/notifications' },
            { title: 'History', icon: 'hourglass_full', link: '/request/history' },
            { title: 'Privacy', icon: 'enhanced_encryption', link: '/privacy' },
            { title: 'Terms and Conditions', icon: 'subject', link: '/terms' },
            { title: 'Help', icon: 'help', link: '/account/help' },
            { title: 'Feedback', icon: 'feedback', link: '/settings/feedback' }
            // { title: 'Rate', icon: 'star', link: ''},
        ]
    }),
    computed: {
        user () {
            return this.$fire.auth.activeUser
        },
        gravatar () {
            return `https://www.gravatar.com/avatar/${md5(this.user.email || '')}?d=mp`
        },
        ...mapGetters({
            isResearcher: 'meta/isResearcher',
            isSourcerer: 'meta/isSourcerer',
            balance: 'meta/balance',
            canMakePayments: 'meta/canMakePayments',
            onboardingComplete: 'meta/onboardingComplete',
            isOrgMember: 'meta/isOrgMember'
        })
    },
    mounted () {
    // console.log('Firebase: ', firebase);
    // console.log(this.$store);
    // console.log('Meta', this.$store.state.meta)
    // this.listenTokenRefresh();
    },
    methods: {
        async logout () {
            await this.$store.dispatch('auth/signOut')
            this.dialog = false
            this.$router.replace('/login')
        }
    /** listenTokenRefresh() {
            const currentMessageToken = window.localStorage.getItem('messagingToken')
            console.log('currentMessageToken', currentMessageToken);
            if(!!currentMessageToken){
                messaging.onTokenRefresh(function() {
                    messaging.getToken().then(function(token) {
                        this.saveToken(token);
                    }).catch(function(err) {
                        console.log('Unable to retrieve refreshed token ', err);
                    });
                });
            }
        },**/
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
</style>
