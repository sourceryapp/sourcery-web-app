<template>
    <v-card>
        <v-card-title class="headline">Add a new card</v-card-title>
        <v-card-text>
            <v-card flat color="transparent">
                <v-form @submit.prevent="addCard">

                    <div class="form-row">

                        <!-- Used to display form errors. -->
                        <v-alert
                        :value="error"
                        type="error"
                        class="my-2"
                        id="card-errors"
                        role="alert"
                        >
                            {{ error.message }}
                        </v-alert>

                        <v-text-field type="text" name="name" v-model="nameOnCard" label="Name on Card"></v-text-field>
                        <div ref="card" class="mt-3">Loading...</div>


                    </div>

                    <v-checkbox
                    v-model="agree"
                    label="I permit Sourcery to use this card for payments."
                    hint="You are authorizing Sourcery to send instructions to the financial institution that issued my card to take payments from my card account in accordance with the terms of my agreement with you."
                    :persistent-hint="true"
                    ></v-checkbox>
                    <p class="caption my-2"></p>

                    <v-layout
                        class="mt-4"
                        justify-end

                    >
                        <v-btn
                        @click="dialog=true"
                        class="primary"
                        type="submit"
                        :loading="loading"
                        :disabled="!agree"
                        >
                        Add Card
                        </v-btn>
                    </v-layout>
                </v-form>

            </v-card>
        </v-card-text>
    </v-card>


</template>

<script>
import { mapGetters } from 'vuex'
import { functions } from "~/plugins/firebase-client-init.js"

let stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY);
let elements = stripe.elements();


	export default {
        name: "addCard",
		data() {
			return {
                cardElement: null,
                nameOnCard: this.$store.state.auth.user.displayName,
                error: false,
                setupIntents: functions.httpsCallable('stripeSetupIntents'),
                saveCard: functions.httpsCallable('stripeSaveCard'),
                agree: false,
                client_secret: false,
                loading: false,
                show: false
			}
        },
        methods: {
            addCard(){
                this.loading = true;
                stripe.confirmCardSetup(
                    this.client_secret,
                    {
                    payment_method: {
                        card: this.cardElement,
                        billing_details: {
                            name: this.nameOnCard,
                        },
                    },
                    }
                ).then(result => {
                    if (result.error) {
                        this.error = result.error;
                        this.loading = false;
                    } else {
                        // The setup has succeeded. Display a success message and send
                        // result.setupIntent.payment_method to your server to save the
                        // card to a Customer
                        console.log("Success", result);
                        this.saveCard({
                            customer: this.$store.state.meta.stripeCustomerId,
                            payment_method: result.setupIntent.payment_method
                        }).then(async result => {
                            if(result.data.object == 'customer'){
                                this.$store.commit('meta/setStripeCustomerId', result.data.id);
                                await this.$store.dispatch('meta/save', 'stripeCustomerId');
                            }
                            this.cardAdded();
                        })

                    }
                });
            },
            /** Runs when a card is successfully added */
            cardAdded(){
                this.$emit('done');
                this.loading = false;
                this.agree = false;
                this.cardElement.clear();
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/activeUser',
                isResearcher: 'meta/isResearcher',
                isSourcerer: 'meta/isSourcerer',
                balance: 'meta/balance',
                canMakePayments: 'meta/canMakePayments'
            }),
        },
        async mounted() {
            console.log(this.value);
            // Get the client secret and store it
            let {data: { client_secret }} = await this.setupIntents();
            this.client_secret = client_secret;

            // Setup the card element for stripe
            // Get a previously generated card, if it exists.
            this.cardElement = elements.getElement('card') || elements.create('card', {
                base: {
                    color: '#32325d',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                    color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            });
            this.cardElement.mount(this.$refs.card);
        }
	}
</script>

<style scoped>
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
