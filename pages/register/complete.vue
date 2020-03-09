<template>
  <v-layout align-center>
      <v-flex xs12 sm6 offset-sm3 lg4 offset-lg4>
            <h1 class="text-xs-center">You're almost done!</h1>
            <template v-if="isResearcher">
                <h2 class="text-xs-center primary--text text--darken-1">You want to request documents.</h2>
                <p>To do this, you'll need to add a credit card to your account.
                    <v-dialog
                        v-model="dialog"
                        lazy
                        max-width="500"
                    >
                        <template v-slot:activator="{ on }">
                            <v-icon color="primary" v-on="on" ripple @click="dialog = true" size="20">help_outline</v-icon>
                        </template>
                        <v-card>
                            <v-card-text>
                                Sourcery uses Stripe, a third-party payment processer used by companies and non-profits you know, such as Target, Lyft and Habitat for Humanity.
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="dialog = false">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </p>
                <p>You can skip this step for now, but you'll need to add a credit card before submitting your request.</p>
            </template>

            <template v-if="isSourcerer">
                <h2 class="text-xs-center primary--text text--darken-1">You want to fulfill document requests for other researchers.</h2>
                <p>To do this, you'll need to add a debit card (or bank info) to your account. 
                    <v-dialog
                        v-model="dialog"
                        lazy
                        max-width="500"
                    >
                        <template v-slot:activator="{ on }">
                            <v-icon color="primary" v-on="on" ripple @click="dialog = true" size="20">help_outline</v-icon>
                        </template>
                        <v-card>
                            <v-card-text>
                                Sourcery uses Stripe, a third-party payment processer used by companies and non-profits you know, such as Target, Lyft and Habitat for Humanity.
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="dialog = false">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </p>
                <p>You can skip this step for now, but you'll need to add a debit card before picking up and claiming a document request.</p>
            </template>

            <!-- <v-layout column align-center justify-center>
                <connect-button class="v-btn--large" @click="markComplete" v-if="!isSourcerer"></connect-button>
                <v-btn @click="markComplete" block large v-if="!isResearcher" color="primary" :to="{name: 'account-credit-cards'}">Add Card</v-btn>
                <v-btn @click.prevent="skip" block large>Skip for now</v-btn>
            </v-layout> -->
            <div class="hidden-xs-only">
                <connect-button class="v-btn--large v-btn--block v-btn--depressed" @click="markComplete" v-if="isSourcerer"></connect-button>
                <v-btn @click="markComplete" block large depressed v-if="isResearcher" color="primary" :to="{name: 'account-credit-cards'}">Add Card</v-btn>
                <v-btn block large color="primary" outline @click.prevent="skip">Skip for Now</v-btn>
            </div>
            <v-card min-width="100%" class="bottom-buttons hidden-sm-and-up">
                <connect-button class="v-btn--large v-btn--block v-btn--depressed" @click="markComplete" v-if="isSourcerer"></connect-button>
                <v-btn @click="markComplete" block large depressed v-if="isResearcher" color="primary" :to="{name: 'account-credit-cards'}">Add Card</v-btn>
                <v-btn block large color="primary" outline @click.prevent="skip">Skip for Now</v-btn>
            </v-card>
            <v-spacer style="height: 122px;"></v-spacer>
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
            accountType: false,
            dialog: false
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
.bottom-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 6px 12px;
    border-radius: 20px 20px 0px 0px;
    z-index: 5;
  }
  h1, h2, h3 {
    margin-bottom: 12px;
  }
  p {
      font-size: 18px;
  }
</style>
