<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        class="mb-4"
      >
        Settings
      </h1>
      <sourcery-card title="General" icon="mdi-cog">
        <!-- <v-list
          color="transparent"
        >
          <toggle-theme />
          <toggle-notifications />
        </v-list> -->
      </sourcery-card>
      <sourcery-card title="Profile" icon="mdi-account-details">
        <!-- <v-list
          color="transparent"
        >
          <dialog-edit-setting
            title="Name"
            icon="mdi-account"
            label="Your Name"
            property-name="displayName"
            vuex-root="auth/activeUser"
            vuex-action="auth/setUpdatedProfileProperty"
            toast-success="Saved name successfully."
            :rules="[$sourceryForms.rules.required]"
          />

          <dialog-edit-password />

          <dialog-readonly-setting
            title="Email"
            icon="mdi-email"
            label="Email"
            propertyName="email"
            vuexRoot="auth/activeUser"
          />

          <dialog-edit-setting
            title="Phone"
            icon="mdi-phone"
            label="Display Phone Number"
            property-name="phone"
            vuex-root="meta/editMeta"
            vuex-action="meta/updateAndSave"
            toast-success="Saved phone successfully."
            :rules="[$sourceryForms.rules.required]"
          />
        </v-list> -->
      </sourcery-card>
      <sourcery-card title="Payment Information" icon="mdi-credit-card-outline">
        <!-- <manage-credit-cards
          :initial-cards="cards"
        /> -->
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import SourceryCard from '~/components/card-with-header.vue'

export default {
    components: { SourceryCard },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        })
    }
}
</script>
