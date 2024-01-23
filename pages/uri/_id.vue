<template>
  <v-flex>
    <h1 class="mb-4">
      Prospective Request Details
    </h1>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-text>
            <h3>Prospective Request ID</h3>
            <p>{{ request.id }}</p>

            <h3>Created At</h3>
            <p>{{ request.created_at | normalDate }}</p>

            <h3>Created By</h3>
            <p>{{ request.user.email }} - {{ request.user.name }}</p>

            <h3>Location</h3>
            <p>{{ request.repository_name }}</p>
            <p>{{ request.repository_location }}</p>

            <h3>Title</h3>
            <p>{{ request.title }}</p>

            <h3>Description</h3>
            <p>{{ request.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <repository-search ref="repository_search" @selected="setRepository" />

        <v-btn
          color="primary"
          depressed
          small
          @click="convertRequest()"
        >
          Convert to Request
        </v-btn>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
import { RequestsProspective } from '~/models/RequestsProspective'

export default {
    middleware: 'auth-guard',
    async asyncData ({ params }) {
        const request = await RequestsProspective.getById(params.id)
        return { request }
    },
    data () {
        return {
            request: {}
        }
    },
    methods: {
        convertRequest () {
            console.log('convertRequest')
            console.log(this.request)
        },
        setRepository (repository) {
            // this.request.repository_id = repository.id
            // this.request.repository_name = repository.name
            // this.request.repository_location = repository.location
            console.log(repository)
        }
    }
}
</script>
