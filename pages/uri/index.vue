<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        class="mb-4"
      >
        Unregistered Institution Requests ({{ requests.length }})
      </h1>

      <v-card
        v-for="(request) in requests"
        :key="request.id"
        outlined
        class="mb-4"
      >
        <v-card-title>{{ request.title }}</v-card-title>
        <v-card-subtitle>{{ request.repository_name }} - {{ request.repository_location }}</v-card-subtitle>
        <v-card-text>
          <p>{{ request.description }}</p>
          <small>{{ request.created_at }}</small>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { RequestsProspective } from '~/models/RequestsProspective'

export default {
    name: 'UnregisteredInstitutionRequests',
    components: {},
    middleware: 'auth-guard',
    async asyncData () {
        const requests = await RequestsProspective.getNonConverted()

        return {
            requests
        }
    }
}
</script>
