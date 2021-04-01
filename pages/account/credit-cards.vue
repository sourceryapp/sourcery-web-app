<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        Payment Information
      </h1>
      <v-card outlined>
        <v-card-title>
          Cards
        </v-card-title>
        <v-list v-if="cards.data.length" two-line>
          <template v-for="(item, index) in cards.data">
            <v-list-item :key="`list-item-${index}`" two-line>
              <v-list-item-avatar :key="`avatar-${index}`">
                <i :class="`pf pf-${item.card.brand}`" aria-hidden="true" :title="item.card.brand" />
              </v-list-item-avatar>

              <v-list-item-content :key="`content-${index}`">
                <v-list-item-title
                  class="font-weight-medium"
                >
                  •••• •••• ••••  {{ item.card.last4 }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Exp: {{ item.card.exp_month }}/{{ item.card.exp_year }}
                </v-list-item-subtitle>

                <v-flex />
              </v-list-item-content>
              <v-list-item-action>
                <p v-if="index == 0" class="text-caption my-0">
                  default
                </p>
                <v-btn v-else icon class="mx-1" @click="deleteCard(item.id)">
                  <v-icon color="primary">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < cards.data.length" :key="`divider-${index}`" />
          </template>
        </v-list>
        <p v-else>
          You have no cards on file.
        </p>

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="primary"
            depressed
            @click="dialog=true"
          >
            Add Card
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialog" width="450" max-width="100%">
      <add-card @done="done" />
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import addCard from '~/components/add-card.vue'

export default {
    name: 'CreditCards',
    components: {
        'add-card': addCard
    },
    async asyncData ({ params, store, app }) {
        const stripeGetPaymentMethods = app.$fire.functions.httpsCallable('stripeGetPaymentMethods')
        const customer_id = store.state.meta.stripeCustomerId
        return {
            cards: (store.state.meta.stripeCustomerId)
                ? (await stripeGetPaymentMethods({ customer: customer_id, type: 'card' })).data
                : { data: [] }
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
    computed: {
        ...mapGetters({
            user: 'auth/activeUser',
            isResearcher: 'meta/isResearcher',
            isSourcerer: 'meta/isSourcerer',
            balance: 'meta/balance',
            canMakePayments: 'meta/canMakePayments'
        })
    },
    mounted () {
        console.log(this.cards)
    },
    methods: {
    /**
         * This runs after the user has added a card.
         */
        done () {
            // Close the dialog
            this.dialog = false

            this.reload()
        },
        async deleteCard (id) {
            if (confirm('Are you sure you want to delete this card?')) {
                const stripeDeleteCard = this.$fire.$functions.httpsCallable('stripeDeleteCard')
                const { data } = await stripeDeleteCard({ card_id: id })
                if (data.id) {
                    this.reload()
                }
            }
        },
        reload () {
            // Reload to update card list
            window.location.reload()
        }

    }
}
</script>

<style scoped>
.pf {
    font-size: 1.2em;
    color: var(--v-primary-base)
}

</style>
