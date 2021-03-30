<template>
  <v-app id="tube">
    <v-app-bar
      app
      color="white"
      max-height="72px"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon
        v-if="user"
        color="primary"
        @click="drawer = !drawer"
      />
      <v-spacer class="d-none d-sm-flex" />
      <v-app-bar-title class="mt-2 ma-0">
        <nuxt-link id="wordmark-link" to="/dashboard">
          <img id="logo" src="/img/sourcery-wordmark.svg" alt="Sourcery Logo" class="">
        </nuxt-link>
      </v-app-bar-title>
      <v-spacer class="d-none d-sm-flex" />
    </v-app-bar>
    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      app
      bottom
    >
      <v-list
        style="background: rgb(146, 79, 190); background: linear-gradient(135deg, rgba(146, 79, 190, 1) 0%, rgba(111, 77, 170, 1) 50%);"
        dark
      >
        <v-list-item>
          <v-list-item-avatar>
            <img :src="gravatar">
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-content v-if="user">
            <v-list-item-title class="text-h6">
              {{ user.displayName }}
            </v-list-item-title>
            <v-list-item-sub-title>{{ user.email }}</v-list-item-sub-title>
          </v-list-item-content>
          <v-list-item-action v-if="isOrgMember">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  dark
                  v-bind="attrs"
                  icon
                  transition="slide-y-transition"
                  v-on="on"
                >
                  mdi-school
                </v-icon>
              </template>
              <span>Institutional Account</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list dense nav>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="item in items1"
            :key="item.title"
            :to="item.link"
            nuxt
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item nuxt active-class @click="dialog=true">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content pa0>
      <v-container fill-height>
        <v-layout
          justify-center
        >
          <nuxt />
        </v-layout>
      </v-container>
    </v-content>
    <v-bottom-navigation
      v-if="user"
      :value="value"
      app
      grow
      color="primary"
      :horizontal="$vuetify.breakpoint.smAndUp"
    >
      <v-btn
        value="dashboard"
        to="/dashboard"
      >
        <span>Dashboard</span>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>

      <v-btn
        value="add"
        to="/request/create"
      >
        <span>New Request</span>
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>

      <v-btn
        value="search"
        to="/jobs"
      >
        <span>Find Jobs</span>
        <v-icon>mdi-briefcase-search</v-icon>
      </v-btn>

      <!-- <v-btn
        value="settings"
        active-class=""
        :class="drawer ? 'v-btn--active' :''"
        @click.stop="drawer = !drawer"
      >
        <span>Settings</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn> -->
    </v-bottom-navigation>

    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          Are you sure you want to log out?
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            nuxt
            depressed
            @click="logout()"
          >
            Log Out
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
            { title: 'Edit Profile', icon: 'mdi-account', link: '/account/profile' },
            { title: 'Payment Options', icon: 'mdi-credit-card-outline', link: '/account/credit-cards' },
            { title: 'Payouts', icon: 'mdi-currency-usd-circle', link: '/account/payouts' },
            { title: 'Notifications', icon: 'mdi-bell', link: '/settings/notifications' },
            { title: 'History', icon: 'mdi-history', link: '/request/history' },
            { title: 'Privacy', icon: 'mdi-security', link: '/privacy' },
            { title: 'Terms and Conditions', icon: 'mdi-text-subject', link: '/terms' },
            { title: 'Help', icon: 'mdi-help-circle', link: '/account/help' },
            { title: 'Feedback', icon: 'mdi-message-alert', link: '/settings/feedback' }
            // { title: 'Rate', icon: 'star', link: ''},
        ]
    }),
    computed: {
        user () {
            return this.$store.getters['auth/activeUser']
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
            try {
                await this.$fire.auth.signOut()
                this.dialog = false
                this.$router.replace('/login')
            } catch (error) {
                console.log(error)
            }
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
    #logo {
      height: 48px
    }
</style>
