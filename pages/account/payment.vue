<template>
  <v-app id="tube">
       <v-flex xs12 sm6 offset-sm3>
            <v-layout column fill-height>
                <v-flex>
                    <v-card>
                        <v-card-title>
                            <h1>Payment Options</h1>
                        </v-card-title>

                        <v-card-text>
                            <p>Sourcery uses Stripe to enable our users to easily send and receive payments... Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, libero? Vitae dolorem itaque ducimus aliquam odit nihil exercitationem totam, minima voluptatem officiis quasi repellendus hic deleniti possimus eius tempora nisi?</p>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn :href="stripeURL" color="primary">Connect with Stripe</v-btn>
                        </v-card-actions>

                    </v-card>

                    <v-divider class="mt-3"></v-divider>
                    <h2 class="mt-3">Debugging:</h2>
                    <h3 class="mt-3">Connect URL</h3>
                    <div class="dont-break">
                        {{stripeURL}}
                    </div>

                    <h3 class="mt-3" v-if="success">New Customer Connected!!!</h3>
                    <div class="dont-break">
                        {{success}}
                    </div>
                </v-flex>
            </v-layout>
       </v-flex>

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

  </v-app>
</template>

<script>
import { Utils } from "~/modules/utilities"
import { UserMeta } from "~/modules/user-meta"
  export default {

    async asyncData ({ query, $axios }){

        if(process.server){
            console.log("Server is processing...")
            // query.code: Code returned from Stripe
            // query.state: The "state" value that was passed to Stripe
            if(query.code){
                // User has registered with Stripe

                try{
                    let { data } = await $axios.post('https://connect.stripe.com/oauth/token', {
                        client_secret: process.env.STRIPE_CLIENT_SECRET,
                        code: query.code,
                        grant_type:'authorization_code'
                    });
                    console.log("Stripe Response", data);
                    return { success: data }
                }catch(error){
                    return { error: error.message }
                }


            }else {
                // Normal page render
                console.log('Normal page render')
                return { success: null}
            }
        }
    },
    data () {
      return {
        error: null,
        success: null,
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
        stripeURL: function() {
            const baseURL = 'https://connect.stripe.com/express/oauth/authorize?';
            const params = {

                // Uses stripe default if run from server-side
                redirect_uri: process.client ? location.protocol + '//' + location.host + location.pathname : null,
                client_id: process.env.STRIPE_CLIENT_ID,
                state: Date.now(),

                // @url https://stripe.com/docs/connect/express-accounts#additional-oauth
                // @url https://stripe.com/docs/connect/oauth-reference#express-account-differences
                'stripe_user[email]': this.$store.getters.activeUser.email,
                'stripe_user[phone_number]': this.$store.getters.activeUser.phoneNumber || null,
                // 'stripe_user[business_type]': 'individual',
                'stripe_user[first_name]': Utils.getFirstName(this.$store.getters.activeUser.displayName),
                'stripe_user[last_name]': Utils.getLastName(this.$store.getters.activeUser.displayName),
                'stripe_user[url]': 'https://research.tube/'

            }
            return baseURL + Utils.buildQueryString(params);
        }
    },
    mounted() {
        console.log("Success:", this.success);
        console.log("Error:", this.error);

        /**
         * Store the stripe info on successful connection to Stripe:Connect
         */
        if(this.success){
            let meta = new UserMeta( this.$store.getters.activeUser.uid );
            meta.set('stripe', this.success);
        }
    }
  }
</script>

<style scoped>
.dont-break {
    font-family: monospace;
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;

}
</style>
