<template>
  <v-layout>
    <v-flex xs12 sm10 xl6 offset-sm1 offset-xl3>
      <h1 class="mb-4">
        Requests
      </h1>

      <v-text-field
        v-model="filter.text"
        class="request-search-input"
        outlined
        clearable
        prepend-inner-icon="mdi-magnify"
        placeholder="Search Requests"
        hide-details
        :rounded="false"
      />

      <v-row justify="end" class="mb-4">
        <v-col class="text-right">
          <v-menu
            v-model="filterOpen"
            :close-on-content-click="false"
            offset-y
            left
            bottom
          >
            <template #activator="{ on, attrs }">
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
              >
                Filter/Sort By
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <span class="text-uppercase">Status</span>
                <v-checkbox
                  v-for="status in statuses"
                  :key="`statuscheck-${status.id}`"
                  v-model="filter.status"
                  :label="status.name"
                  color="#644ea2"
                  :value="status.id"
                  hide-details
                />
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="request in filteredRequests" :key="request.id" xs="12" md="6">
          {{ request.citation }}
        </v-col>
      </v-row>

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

        <template
          #item.actions="{ item }"
        >
          <v-icon
            small
            class="mr-2"
            @click="viewRequest(item)"
          >
            mdi-eye
          </v-icon>
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
        const jobs = await Request.getForRepositories(user_repositories, ['Submitted', 'In Progress', 'Complete', 'Archived', 'Cancelled'])

        const statuses = await Status.getAll()

        return {
            jobs,
            statuses,
            filter
        }
    },
    data () {
        return {
            filterOpen: false,
            jobs: [],
            statuses: [],
            filter: {
                status: [],
                text: ''
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
                },
                {
                    text: 'Actions',
                    value: 'actions'
                }
            ]
        }
    },
    computed: {
        filteredRequests () {
            let requests = Array.from(this.jobs)

            if (this.filter.text) {
                requests = requests.filter((x) => {
                    return x.citation.toLowerCase().includes(this.filter.text.toLowerCase()) || x.request_vendor?.label.toLowerCase().includes(this.filter.text.toLowerCase())
                })
            }

            if (this.filter.status.length > 0) {
                requests = requests.filter((x) => {
                    return this.filter.status.includes(x.status_id)
                })
            }

            return requests
        }
    },
    methods: {
        clearFilter () {
            this.filter = {
                status: []
            }
        },
        viewRequest (request) {
            this.$router.push(`/request/${request.id}`)
        }
    }
}
</script>

<style scoped>
.request-search-input {
  font-size: 24px;
}
</style>

<style>
.request-search-input input {
  padding-left: 20px;
}
</style>
