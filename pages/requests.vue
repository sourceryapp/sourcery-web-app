<template>
  <v-layout>
    <v-flex xs12 sm10 xl6 offset-sm1 offset-xl3>
      <h1 class="mb-4">
        Requests
      </h1>
      <div class="mb-4">
        <v-checkbox
          v-for="status in statuses"
          :key="`statuscheck-${status.id}`"
          v-model="filter.status"
          :label="status.name"
          color="#644ea2"
          :value="status.id"
          hide-details
        />
      </div>

      <v-data-table
        :headers="headers"
        :items="jobs"
      >
        <template
          #item.status="{ item }"
        >
          <v-chip color="purple">
            {{ item.status.name }}
          </v-chip>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { Request } from '~/models/Request'
import { Status } from '~/models/Status'

export default {
    async asyncData ({ route, store }) {
        const filter = {
            status: []
        }
        if (route.query.status) {
            filter.status = route.query.status.split(',').map(x => parseInt(x))
        }

        const user_repositories = store.getters['supabaseAuth/userRepositories']
        const jobs = await Request.getForRepositories(user_repositories, ['Submitted', 'Picked Up', 'Complete', 'Archived', 'Cancelled'])

        const statuses = await Status.getAll()

        return {
            jobs,
            statuses,
            filter
        }
    },
    data () {
        return {
            jobs: [],
            statuses: [],
            filter: {
                status: []
            },
            headers: [
                {
                    text: 'Citation',
                    value: 'citation'
                },
                {
                    text: 'Status',
                    value: 'status',
                    filter: (value) => {
                        if (this.filter.status.length < 1) {
                            return true
                        }
                        return this.filter.status.includes(value.id)
                    }
                }
            ]
        }
    },
    methods: {
        clearFilter () {
            this.filter = {
                status: []
            }
        }
    }
}
</script>
