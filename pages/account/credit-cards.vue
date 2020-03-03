<template>
  <v-layout>
       <v-flex xs12 sm6 offset-sm3>
            <v-layout column fill-height>
                <v-flex>
                    <v-card width="100%">
                        <v-card-title>
                            <h1>Credit Cards</h1>
                        </v-card-title>
                        <v-card-text>

                            <h3>Cards on File</h3>
                              <v-data-table
                                v-if="cards"
                                :headers="headers"
                                :items="cards.data"
                                :hide-headers="!cards"
                                hide-actions
                                no-data-text="You have no cards on file."
                            >
                                <template v-slot:items="props">
                                <td class="text-xs">{{ props.item.card.brand }}</td>
                                <td class="text-xs">**** {{ props.item.card.last4 }}</td>
                                <td class="text-xs">{{ props.item.card.exp_month }}/{{ props.item.card.exp_year }}</td>
                                <!-- <td class="text-xs">Delete</td> -->
                                </template>
                            </v-data-table>


                        </v-card-text>

                        <v-card-actions>
                            <v-layout
                                justify-end

                            >
                                <v-btn
                                @click="dialog=true"
                                class="primary"
                                >
                                Add Card
                                </v-btn>
                            </v-layout>

                        </v-card-actions>

                    </v-card>

                </v-flex>
            </v-layout>
       </v-flex>

    <v-dialog v-model="dialog" width="450" max-width="100%">
        <add-card @done="done"></add-card>
    </v-dialog>



  </v-layout>
</template>

<script>
import { functions } from "~/plugins/firebase-client-init.js"
import addCard from "~/components/add-card.vue";
import { mapGetters } from 'vuex'

  export default {
    name: "credit-cards",
    async asyncData ({ params, store }) {
        let stripeGetPaymentMethods = functions.httpsCallable('stripeGetPaymentMethods');
        let customer_id = store.state.meta.stripeCustomerId;
        return {
            cards: (store.state.meta.stripeCustomerId) ?
            (await stripeGetPaymentMethods({ customer: customer_id, type: 'card'})).data :
            []
        }
    },
    data () {
      return {
          headers: [
              {
                  text: "Type",
                  align: 'left',
                  sortable: false
              },
              {
                  text: "Number",
                  sortable: false
              },
              {
                  text: "Exp.",
                  sortable: false
              }
          ],
          cards: [],
          dialog: false
      }
    },
    components: {
        'add-card': addCard
    },
    computed: {
      ...mapGetters({
          user: 'auth/activeUser',
          isResearcher: 'meta/isResearcher',
          isSourcerer: 'meta/isSourcerer',
          balance: 'meta/balance',
          canMakePayments: 'meta/canMakePayments'
      })
    },
    methods: {
        /**
         * This runs after the user has added a card.
         */
        done(){
            // Close the dialog
            this.dialog = false;

            // Reload to update card list
            window.location.reload();
        }
    },
    async mounted() {

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
