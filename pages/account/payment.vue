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
                            <v-btn v-if="!stripeDashboardURL" :href="stripeURL" color="primary">Connect with Stripe</v-btn>
                            <v-btn v-if="stripeDashboardURL" :href="stripeDashboardURL"  color="primary">Manage Your Payment Options</v-btn>
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

        let error, success;

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
            usermeta: await Utils.getUserMeta( store.getters.activeUser.uid )
        }
    },
    data () {
      return {
        stripeConnect: null,
        error: null,
        success: null,
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
        },
        stripeDashboardURL: function() {
            return this.usermeta.stripe.stripe_user_id ? `/stripe/dashboard/?acct=${this.usermeta.stripe.stripe_user_id}` : false;
        }
    },
    async mounted() {
        console.log("Success:", this.success);
        console.log("Error:", this.error);

        console.log("Stripe URL:", this.stripeURL)

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
