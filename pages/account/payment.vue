<template>
  <v-app id="tube">
       <v-flex xs12 sm6 offset-sm3>
            <v-layout column fill-height>
                <v-flex>
                    <v-card width="100%">
                        <v-card-title>
                            <h1>Payment Options</h1>
                        </v-card-title>
                        <v-card-text>
                            <p v-if="!hasStripeID">Before using Sourcery, you must configure your payment options. </p>
                            <p v-if="hasStripeID">Your payment options have been configured. Use the button below to check your balance, change your payment information, or modify your payout schedule.</p>
                            <p v-if="balance">Current Balance: {{ balanceFormatted(this.balance.available[0].amount) }} </p>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn v-if="!hasStripeID" :href="stripeURL" color="primary">Connect with Stripe</v-btn>
                            <v-btn v-if="hasStripeID" :href="stripeDashboardURL"  color="primary">Manage Your Payment Options</v-btn>
                        </v-card-actions>

                    </v-card>

                </v-flex>
            </v-layout>
       </v-flex>

  </v-app>
</template>

<script>
import { Utils } from "~/modules/utilities"
import { functions } from "~/plugins/firebase-client-init.js"
  export default {

    async asyncData ({ query, $axios, store }){

        let usermeta, balance;

        // Usermeta can be retrieved on server and client sides
        usermeta = await Utils.getUserMeta( store.getters.activeUser.uid );

        if(usermeta && usermeta.stripe && usermeta.stripe.stripe_user_id){
            console.info("Retrieving User Balance")
            try{
                let { data } = await $axios.get('balance',{
                    params: {
                        acct: usermeta.stripe.stripe_user_id
                    }
                });
                balance = data;
            }catch(err){
                console.error(err);
            }

        }

        return {
            usermeta: usermeta,
            balance: balance
        }
    },
    data () {
      return {
        stripeConnect: null,
        balance: null
      }
    },
    computed: {
        hasStripeID: function(){
            return (this.usermeta && this.usermeta.stripe && this.usermeta.stripe.stripe_user_id)
        },
        stripeURL: function() {
            // console.log("Current Route", location.protocol + '//' + location.host + this.$router.currentRoute.path);
            if(this.$store.getters.activeUser){
                const baseURL = 'https://connect.stripe.com/express/oauth/authorize?';

                // Parameters sent to Stripe
                const params = {
                    redirect_uri: process.env.API_URL + 'linkStripe',
                    client_id: process.env.STRIPE_CLIENT_ID,

                    /**
                     * These parameters help us maintain state and are sent to the cloud
                     * function to complete the connection
                     */
                    state: JSON.stringify({
                        redirect_uri: location.protocol + '//' + location.host + this.$router.currentRoute.path,
                        user_id: this.$store.getters.activeUser.uid
                    }),

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
            }else {
                return "#";
            }

        },
        stripeDashboardURL: function() {
            return (this.usermeta && this.usermeta.stripe.stripe_user_id) ? `${process.env.API_URL}dashboard/?acct=${this.usermeta.stripe.stripe_user_id}` : false;
        },
    },
    methods: {
        balanceFormatted: (balance) => Utils.currencyFormat( balance )
    },
    async mounted() {
        console.log("Stripe URL:", this.stripeURL)
        console.log("User Balance:", this.balance)
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
