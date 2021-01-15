<template>
  <v-btn :href="buttonLink" color="primary" @click="$emit('click', $event)">
    {{ buttonText }}
  </v-btn>
</template>

<script>
export default {
    name: 'ConnectButton',
    props: {
        alt: {
            type: String,
            required: false,
            default: ''
        },
        repository: {
            type: Object,
            required: true,
            default: null
        }
    },
    data () {
        return {

        }
    },
    computed: {
        buttonLink () {
            return this.$store.getters['meta/canReceivePayments'] ? this.stripeDashboardURL : this.stripeURL
        },
        buttonText () {
            return this.$store.getters['meta/canReceivePayments'] ? 'Manage Your Payout Settings' : 'Connect to Stripe'
        },
        usermeta () {
            return this.$store.state.meta
        },
        balance () {
            return this.$store.getters['meta/balance']
        },
        hasStripeID () {
            return (this.usermeta && this.usermeta.stripe && this.usermeta.stripe.stripe_user_id)
        },
        stripeURL () {
            // console.log("Current Route", location.protocol + '//' + location.host + this.$router.currentRoute.path);
            if (this.$store.getters['auth/activeUser']) {
                const baseURL = 'https://connect.stripe.com/express/oauth/authorize?'

                // Parameters sent to Stripe
                const params = {
                    redirect_uri: process.env.API_URL + 'linkStripe',
                    client_id: process.env.STRIPE_CLIENT_ID,

                    /**
                         * These parameters help us maintain state and are sent to the cloud
                         * function to complete the connection
                         */
                    state: JSON.stringify({
                        redirect_uri: location.protocol + '//' + location.host + '/dashboard',
                        user_id: this.$store.getters['auth/activeUser'].uid
                    }),

                    // @url https://stripe.com/docs/connect/express-accounts#additional-oauth
                    // @url https://stripe.com/docs/connect/oauth-reference#express-account-differences
                    'stripe_user[email]': this.$store.getters['auth/activeUser'].email,
                    'stripe_user[phone_number]': this.$store.state.meta.phone,
                    'stripe_user[business_type]': 'individual',
                    'stripe_user[first_name]': this.$utils.getFirstName(this.$store.getters['auth/activeUser'].displayName),
                    'stripe_user[last_name]': this.$utils.getLastName(this.$store.getters['auth/activeUser'].displayName)

                }
                return baseURL + this.$utils.buildQueryString(params)
            } else {
                return '#'
            }
        },
        stripeDashboardURL () {
            return (this.usermeta && this.usermeta.stripe.stripe_user_id) ? `${process.env.API_URL}dashboard/?acct=${this.usermeta.stripe.stripe_user_id}` : false
        }
    }
}
</script>

<style scoped>
img {
    width: 100%;
    max-width: 100%;
}
</style>
