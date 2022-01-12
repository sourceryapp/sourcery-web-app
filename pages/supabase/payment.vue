<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <pre>{{ editingPaymentAssociation }}</pre>
    </v-flex>
  </v-layout>
</template>

<script>
/** This view is incomplete, as payment is temporarily disabled. */
import { mapGetters, mapActions } from 'vuex'

export default {
    async asyncData ({ store }) {
        const result = await store.dispatch('supabase/fetchAuthUserPaymentAssociation')
        console.log(result)
        return {
            editingPaymentAssociation: store.state.supabase.authUserPaymentAssociation
        }
    },
    computed: {
        ...mapGetters({
            paymentAssociation: 'supabase/authUserPaymentAssociation'
        })
    },
    methods: {
        ...mapActions({
            save: 'supabase/saveAuthUserPaymentAssociation'
        })
    }
}
</script>
