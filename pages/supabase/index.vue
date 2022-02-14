<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <p v-if="user">
        Email: {{ user.email }}
      </p>
      <log-out />
      <pre>{{ user }}</pre>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import LogOut from '~/components/supabase/log-out.vue'

export default {
    components: { LogOut },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        })
    }
}
</script>
