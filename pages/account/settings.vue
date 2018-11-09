<template>
    <v-container justify-center>
        <h1>Settings</h1>
        <v-navigation-drawer permanent width="400px">
            <v-toolbar flat>
            <v-list>
                <v-list-tile>
                <v-list-tile-title class="title">
                    Account
                </v-list-tile-title>
                </v-list-tile>
            </v-list>
            </v-toolbar>

            <v-divider></v-divider>

            <v-list dense class="pt-0" two-line>
            <v-list-tile
                v-for="item in items1"
                :key="item.title"
                :to = "item.link"
            >
                <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-navigation-drawer permanent width="400px">
            <v-toolbar flat>
            <v-list>
                <v-list-tile>
                <v-list-tile-title class="title">
                    Info and Feedback
                </v-list-tile-title>
                </v-list-tile>
            </v-list>
            </v-toolbar>

            <v-divider></v-divider>

            <v-list dense class="pt-0" two-line>
            <v-list-tile
                v-for="item in items2"
                :key="item.title"
            >
                <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>


<script>
  export default {
    data () {
      return {
        items1: [
          { title: 'Edit Profile', icon: 'person', link: '/account/profile'},
          { title: 'Notifications', icon: 'notifications', link: '/account/profile'},
          { title: 'History', icon: 'hourglass_full', link: '/account/profile'},
          { title: 'Privacy', icon: 'enhanced_encryption', link: '/account/profile'}
        ],
        items2: [
          { title: 'Terms and Conditions', icon: 'subject', link: '/account/profile'},
          { title: 'Helpful Information', icon: 'list', link: '/account/profile'},
          { title: 'Feedback', icon: 'feedback', link: '/account/profile'},
          { title: 'Rate', icon: 'star', link: '/account/profile'},
        ],
        right: null
      }
    }
  }
</script>

<style scoped>
</style>