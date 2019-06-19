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
                            <p v-if="!usermeta.stripe.stripe_user_id">Before using Sourcery, you must configure your payment options. </p>
                            <p v-if="usermeta.stripe.stripe_user_id">Your payment options have been configured. Use the button below to check your balance, change your payment information, or modify your payout schedule.</p>
                            <p v-if="balance">Current Balance: ${{ balance.available[0].amount }} </p>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn v-if="!usermeta.stripe.stripe_user_id" :href="stripeURL" color="primary">Connect with Stripe</v-btn>
                            <v-btn v-if="usermeta.stripe.stripe_user_id" :href="stripeDashboardURL"  color="primary">Manage Your Payment Options</v-btn>
                        </v-card-actions>

                    </v-card>

                </v-flex>
            </v-layout>
       </v-flex>

  </v-app>
</template>

<script>
import { Utils } from "~/modules/utilities"
  export default {

    async asyncData ({ query, $axios, store }){

        let error, success, usermeta, balance;

        // Usermeta can be retrieved on server and client sides
        usermeta = await Utils.getUserMeta( store.getters.activeUser.uid );

        if(usermeta.stripe.stripe_user_id){
            console.info("Retrieving User Balance")
            try{
                let { data } = await $axios.get('/stripe/balance',{
                    params: {
                        acct: usermeta.stripe.stripe_user_id
                    }
                });
                balance = data;
            }catch(err){
                console.error(err);
            }

        }

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
                    success = data
                }catch(err){
                    error = err
                }


            }else {
                // Normal page render
                console.log('Normal page render')
                success =  null
            }

        }

        return {
            success: success,
            error: error,
            usermeta: usermeta,
            balance: balance
        }
    },
    data () {
      return {
        stripeConnect: null,
        error: null,
        success: null,
        balance: null
      }
    },
    computed: {
        stripeURL: function() {
            if(this.$store.getters.activeUser){
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
            }else {
                return "#";
            }

        },
        stripeDashboardURL: function() {
            return this.usermeta.stripe.stripe_user_id ? `/stripe/dashboard/?acct=${this.usermeta.stripe.stripe_user_id}` : false;
        }
    },
    async mounted() {
        console.log("Success:", this.success);
        console.log("Error:", this.error);

        console.log("Stripe URL:", this.stripeURL)
        console.log("User Balance:", this.balance)

        /**
         * Store the stripe info on successful connection to Stripe:Connect
         */
        if(this.success){
            this.$meta.set('stripe', this.success);
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
