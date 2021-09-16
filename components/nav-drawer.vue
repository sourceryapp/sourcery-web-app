<template>
  <v-navigation-drawer
    :value="drawer"
    app
    bottom
    :class="$vuetify.breakpoint.mobile ? 'rounded-t-xl' : ''"
  >
    <v-list
      style="background: rgb(146, 79, 190); background: linear-gradient(135deg, rgba(146, 79, 190, 1) 0%, rgba(111, 77, 170, 1) 50%);"
      dark
    >
      <v-list-item>
        <v-list-item-avatar>
          <img v-if="user" :src="gravatar">
          <img v-else src="https://www.gravatar.com/avatar/?d=mp">
        </v-list-item-avatar>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title v-if="user" class="text-h6">
            {{ user.displayName }}
          </v-list-item-title>
          <v-list-item-title v-else class="text-h6">
            Logged Out
          </v-list-item-title>
          <v-list-item-subtitle v-if="user">
            {{ user.email }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="isOrgMember">
            Institutional Account
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="!user">
            Log in for access to all features.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider v-if="user" />

    <v-list dense nav>
      <v-list-item-group
        color="primary"
      >
        <v-list-item
          v-for="item in items1"
          :key="item.title"
          :to="item.link"
          nuxt
          exact
          class="hidden-sm-and-down"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-divider v-if="user" class="my-2 hidden-sm-and-down" />
      <v-list-item-group
        v-if="user"
        color="primary"
      >
        <v-list-item
          v-for="item in items2"
          :key="item.title"
          :to="item.link"
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

      <v-divider
        v-if="user && user.admin"
        class="my-2 hidden-sm-and-down"
      />
      <v-subheader v-if="user && user.admin">
        DEV ONLY
      </v-subheader>

      <v-list-item-group
        v-if="user && user.admin"
        color="primary"
      >
        <v-list-item
          v-for="item in devItems"
          :key="item.title"
          :to="item.link"
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="toggleDark()">
          <v-list-item-icon>
            <v-icon>
              mdi-theme-light-dark
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              Toggle Dark Mode
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

      <v-divider
        v-if="user && user.admin"
        class="my-2 hidden-sm-and-down"
      />

      <v-list-item v-if="user" nuxt active-class @click="dialog=true">
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-2">
            Log Out
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template #append>
      <v-list nav dense>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="item in bottomItems"
            :key="item.title"
            :to="item.link"
            nuxt
            exact
            style="min-height: 18px;"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </template>

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
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import md5 from 'md5'

export default {
    name: 'NavigationDrawer',
    props: {
        drawer: {
            type: Boolean,
            required: false,
            default: null
        }
    },
    data: () => ({
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
            { title: 'Organizations', icon: 'mdi-domain', link: '/o' }
        ],
        bottomItems: [
            { title: 'Privacy Policy', link: '/privacy' },
            { title: 'Terms and Conditions', link: '/terms' }
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

<style scoped>
.v-list-item__title, .v-list-item__subtitle {
  white-space: wrap;
}
.v-list-item--dense .v-list-item__content, .v-list--dense .v-list-item .v-list-item__content {
  padding: 4px 0;
}
</style>
