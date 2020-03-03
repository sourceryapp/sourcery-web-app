<template>
  <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card flat color="transparent">
            <h1>You're almost done!</h1>

            <p>Thanks for becoming a member of the Sourcery Community... yada yada yada.</p>

            <template v-if="isResearcher">
            <h3>User Chose to be a Client</h3>
            <p>Process explaining CC card setup</p>
            </template>

            <template v-if="isSourcerer">
            <h3>User Chose to be a Sourcerer</h3>
            <p>Copy explaining process for a Sourcerer</p>
            </template>

            You can complete this step now, or skip to continue browsing the Sourcery app.


            <v-layout row align-center justify-center>
                <v-btn @click.prevent="skip">Skip for now</v-btn>
                <connect-button @click="markComplete" v-if="isSourcerer"></connect-button>
                <v-btn @click="markComplete" v-if="isResearcher" color="primary" :to="{name: 'account-credit-cards'}">Add Card</v-btn>
            </v-layout>


    </v-card>
    </v-flex>




  </v-layout>
</template>

<script>
import { Auth, db } from "~/plugins/firebase-client-init.js";
import connectButton from "~/components/connect-button.vue";
import { mapGetters } from 'vuex'


export default {

    name: "complete",

    /**
     * Don't show this page if onboarding is complete:
     */
    middleware: function({ store, $axios, redirect, route, error }){
        if(store.getters['meta/onboardingComplete']){
            redirect({name: 'dashboard'})
        }
    },

    /**
     * Retrieve the account type from our Store
     */
    asyncData({ store }){
        return { accountType: store.getters['meta/isResearcher'] ? 'researcher' : 'sourcerer' }
    },
    data() {
        return {
            accountType: false
        };
    },
    components: {
        'connect-button': connectButton,
    },
    computed: {
      ...mapGetters({
          user: 'auth/activeUser',
          isResearcher: 'meta/isResearcher',
          isSourcerer: 'meta/isSourcerer'
      })
    },
    methods: {
        async skip() {
            await this.markComplete();
            this.$router.push({name: 'dashboard'})
        },
        async markComplete(){
            this.$store.commit('meta/setOnboardingComplete', true);
            console.log("it worked");
            await this.$store.dispatch('meta/save', 'onboardingComplete');
        },
        mounted() {
            console.log(this.accountType);
        }
    }
};
</script>

<style scoped>
</style>
