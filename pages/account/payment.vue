<template>
  <v-app id="tube">
      <!--
        <v-card width="375px">
            <v-card-title class="headline">Payment Options</v-card-title>
            <v-list>
                <template v-for="(item) in items">
                    <v-list-tile
                    :key="item.title"
                    avatar
                    :to = "item.link"
                    >
                    <v-list-tile-avatar>
                        <img :src="item.avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title><span class='text--primary'>Card Number: &emsp; ****{{item.title}}</span></v-list-tile-title>
                        <v-list-tile-sub-title><span class='text--primary'>Added: &emsp; {{item.subtitle}}</span></v-list-tile-sub-title>
                    </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
            <v-btn to="/payment/new_card"><span>Add a New Card</span></v-btn>
        </v-card>
        <v-card width="375px" style="top: 30px">
          <v-card-title class="headline">Promotions</v-card-title>
          <v-list>
                <template v-for="(item) in promotions">
                    <v-list-tile
                    :key="item.title"
                    avatar
                    :to = "item.link"
                    >
                    <v-list-tile-avatar>
                        <img :src="item.avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title><span class='text--primary'>{{item.title}}</span></v-list-tile-title>
                        <v-list-tile-sub-title><span class='text--primary'>Valid until: &emsp; {{item.subtitle}}</span></v-list-tile-sub-title>
                    </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-card>
        <v-card width="375px" style="top: 60px">
          <v-card-title class="headline">Agent Payment Destinations</v-card-title>
          <v-btn><span>Add New Payment Destination</span></v-btn>
        </v-card>
        -->
        <v-card>
            <h1>Setup Payments</h1>

            <v-btn :href="stripeURL">Stripe</v-btn>
        </v-card>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          {
            avatar: "/img/mastercard_2.jpg",
            title: '0000',
            subtitle: '00/00',
            link: "/payment/view_card"
          },
          {
            avatar: "/img/social-share.jpg",
            title: '0001',
            subtitle: '02/52',
            link: "/payment/view_card"
          },

        ],
        promotions: [
          {
            avatar: "/img/logo.jpg",
            title: "5% Off First 10 Requests",
            subtitle: "00/00",
            link: "/payment/promotion"
          }
        ]
      }
    },
    computed: {
        stripeURL: () => {
            const baseURL = 'https://connect.stripe.com/express/oauth/authorize?';
            const params = {
                redirect_uri: 'https://stripe.com/connect/default/oauth/test',
                client_id: process.env.STRIPE_CLIENT_ID,
                state: Date.now(),
                'stripe_user[email]': 'someemail'


            }
            return baseURL + Object.keys(params).map(key => key + '=' + params[key]).join('&');
        }
    },
    mounted() {
        console.log(this.$store.getters.activeUser);
    }
  }
</script>

<style scoped>

</style>
