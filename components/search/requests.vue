<template>
  <div class="search-requests">
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

    <v-row justify="end">
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
      <v-col>
        <v-chip v-for="(s, index) in filter.status" :key="s" class="ma-2" close @click:close="removeStatusFromFilter(index)">
          {{ statuses.find(x => x.id === s).name }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row v-if="filteredRequests.length > 0">
      <v-col v-for="request in filteredRequests" :key="request.id" cols="12" md="6">
        <request-listing :request="request" :client="clientView" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <p>No requests for the current filter.</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Request } from '~/models/Request'
import { Status } from '~/models/Status'

export default {
    props: {
        type: {
            type: String,
            default: 'researcher'
        }
    },
    data () {
        return {
            filterOpen: false,
            requests: [],
            filter: {
                status: [],
                text: ''
            },
            statuses: []
        }
    },
    async fetch () {
        if (this.$route.query.status) {
            this.filter.status = this.$route.query.status.split(',').map(x => parseInt(x))
        }
        this.statuses = await Status.getAll()
        await this.fetchRequests()
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            userRepositories: 'supabaseAuth/userRepositories'
        }),
        clientView () {
            return this.type === 'researcher'
        },
        filteredRequests () {
            let requests = Array.from(this.requests)

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
        ...mapActions({
            syncUsers: 'supabaseUserCache/sync_users'
        }),
        clearFilter () {
            this.filter = {
                status: [],
                text: ''
            }
        },
        viewRequest (request) {
            this.$router.push(`/request/${request.id}`)
        },
        removeStatusFromFilter (index) {
            this.filter.status.splice(index, 1)
        },
        async fetchRequests (filterChange = false) {
            const offset = filterChange ? 0 : this.requests.length
            let new_requests = []
            if (this.type === 'researcher') {
                new_requests = await Request.getForCreator(this.authUser.id, this.filter.status, offset)
            } else if (this.type === 'organization') {
                new_requests = await Request.getForRepositories(this.userRepositories, this.filter.status, offset)
            }

            const new_user_ids = new_requests.map(x => x.user_id).filter((val, index, arr) => {
                return arr.indexOf(val) === index
            })
            await this.syncUsers(new_user_ids)

            if (filterChange) {
                this.requests = new_requests
            } else {
                this.requests.push(...new_requests)
            }

            return true
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
