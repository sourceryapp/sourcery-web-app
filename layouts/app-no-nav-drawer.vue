<template>
  <v-app id="tube">
    <v-icon>
      mdi-caret-right
    </v-icon>
    <v-main pa0>
      <v-container fill-height>
        <v-layout
          justify-center
        >
          <nuxt />
        </v-layout>
      </v-container>
    </v-main>
    <v-bottom-navigation
      v-if="user && $vuetify.breakpoint.mobile"
      app
      grow
      color="primary"
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

      <!-- <v-btn
        value="search"
        to="/jobs"
      >
        <span>Find Jobs</span>
        <v-icon>mdi-briefcase-search</v-icon>
      </v-btn> -->

      <v-btn
        value="settings"
        to="/settings"
      >
        <span>Settings</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
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
            color="error"
            nuxt
            text
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
            // { title: 'Edit Profile', icon: 'mdi-account', link: '/account/profile' },
            { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/dashboard' },
            { title: 'Create Request', icon: 'mdi-plus-circle', link: '/request/create' }
            // { title: 'Find Jobs', icon: 'mdi-briefcase-search', link: '/jobs', desktopOnly: 'true' },
        ],
        items2: [
            { title: 'History', icon: 'mdi-history', link: '/request/history' },
            { title: 'Settings', icon: 'mdi-cog', link: '/settings' },
            // { title: 'Payment Options', icon: 'mdi-credit-card-outline', link: '/account/credit-cards' },
            // { title: 'Payouts', icon: 'mdi-currency-usd-circle', link: '/account/payouts' },
            // { title: 'Notifications', icon: 'mdi-bell', link: '/settings/notifications' },
            // { title: 'Privacy', icon: 'mdi-security', link: '/privacy' },
            // { title: 'Terms and Conditions', icon: 'mdi-text-subject', link: '/terms' },
            { title: 'FAQ', icon: 'mdi-frequently-asked-questions', link: '/account/faq' },
            { title: 'Feedback', icon: 'mdi-comment-quote', link: '/settings/feedback' }
            // { title: 'Rate', icon: 'star', link: ''},
        ],
        devItems: [
            { title: 'Organizations', icon: 'mdi-account-group', link: '/o' }
        ]
    }),
    computed: {
        gravatar () {
            return `https://www.gravatar.com/avatar/${md5(this.user.email || '')}?d=mp`
        },
        ...mapGetters({
            isResearcher: 'meta/isResearcher',
            isSourcerer: 'meta/isSourcerer',
            balance: 'meta/balance',
            canMakePayments: 'meta/canMakePayments',
            onboardingComplete: 'meta/onboardingComplete',
            isOrgMember: 'meta/isOrgMember',
            user: 'auth/activeUser'
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
        },
        toggleDark () {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
            localStorage.setItem('dark_theme', this.$vuetify.theme.dark.toString())
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
    .v-dialog > .v-card > .v-card__actions {
      padding: 8px
    }
</style>
