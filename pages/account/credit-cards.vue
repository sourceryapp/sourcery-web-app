<template>
  <v-layout>
       <v-flex xs12 sm6 offset-sm3>
            <v-layout column fill-height>
                <v-flex>
                    <v-card width="100%">
                        <v-card-title>
                            <h1>Payment Information</h1>
                        </v-card-title>
                        <v-card-text>


                            <v-list two-line v-if="cards.data.length">
                                <v-subheader>
                                    Cards
                                </v-subheader>
                                <template v-for="(item, index) in cards.data">
                                    <v-divider :key="`divider-${index}`"></v-divider>

                                    <v-list-tile :key="`list-item-${index}`">
                                        <v-list-tile-avatar :key="`avatar-${index}`">
                                            <i :class="`pf pf-${item.card.brand}`" aria-hidden="true" :title="item.card.brand"></i>
                                        </v-list-tile-avatar>

                                        <v-list-tile-content :key="`content-${index}`">
                                            <v-layout style="width:100%" justify-space-between align-center>
                                                    <v-list-tile-title>
                                                        **** **** ****  {{ item.card.last4 }}
                                                    </v-list-tile-title>
                                                    <v-list-tile-sub-title>
                                                        Exp: {{ item.card.exp_month }}/{{ item.card.exp_year }}
                                                    </v-list-tile-sub-title>

                                                <v-flex  >
                                                </v-flex>
                                            </v-layout>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <p v-if="index == 0" class="caption font-weight-thin my-0">
                                                    default
                                            </p>
                                            <v-btn v-else icon class="mx-1"  @click="deleteCard(item.id)">
                                                <v-icon color="primary">delete</v-icon>
                                            </v-btn>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                </template>
                            </v-list>
                            <p v-else>You have no cards on file.</p>


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
            {data:[]}
        }
    },
    data () {
      return {
          cards: {
              data: []
          },
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

            this.reload();
        },
        async deleteCard(id){
            if(confirm("Are you sure you want to delete this card?")){
                let stripeDeleteCard = functions.httpsCallable('stripeDeleteCard');
                let { data } = await stripeDeleteCard({ card_id: id });
                if(data.id){
                    this.reload();
                }
            }
        },
        reload(){
            // Reload to update card list
            window.location.reload();
        }

    },
    async mounted() {
        console.log(this.cards);
    }
  }
</script>

<style scoped>
.pf {
    font-size: 1.2em;
    color: var(--v-primary-base)
}

</style>
