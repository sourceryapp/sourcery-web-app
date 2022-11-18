<template>
  <div class="request-events">
    <v-card class="pa-5">
      <v-card-title>Request Activity Log &amp; Internal Notes</v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="4" lg="3" cols="6">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="SORT BY"
              outlined
              dense
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="event-scroller">
              <v-simple-table
                fixed-header
                :height="tableHeight"
                dense
                class="sourcery-simple-table"
              >
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left text-h5 pa-2 pl-4 font-weight-medium">
                        Action / Notes
                      </th>
                      <th class="text-left text-h5 pa-2 pl-4 font-weight-medium">
                        Date/Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(event, index) in eventRows"
                      :key="`event-row-${index}`"
                    >
                      <td>{{ event.text }}</td>
                      <td>{{ event.time | normalDateAndTime }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { Request } from '~/models/Request'
import { RequestEvent } from '~/models/RequestEvent'
export default {
    props: {
        request: {
            type: Request,
            required: true
        }
    },
    data () {
        return {
            events: [],
            sortBy: null,
            sortOptions: [
                'Oldest First',
                'Recent First',
                'User'
            ]
        }
    },
    async fetch () {
        this.events = await RequestEvent.getForRequestId(this.request.id)
    },
    computed: {
        tableHeight () {
            const avgHeight = 32
            const pad = 120
            const predictedHeight = (avgHeight * this.events.length) + pad
            const ceiling = 300

            if (predictedHeight < ceiling) {
                return `${predictedHeight}px`
            }
            return `${ceiling}px`
        },
        eventRows () {
            let e = this.events.map((x) => {
                return {
                    text: this.eventText(x),
                    time: x.created_at,
                    user_id: x.user_id
                }
            })
            e.unshift({
                text: 'Request created.',
                time: this.request.created_at,
                user_id: null
            })
            e.push({
                text: 'Current',
                time: new Date().toISOString(),
                user_id: null
            })

            if (this.sortBy) {
                switch (this.sortBy) {
                case 'Oldest First':
                    e.sort(this.$sourcerySorts.sortByTimePropertyAsc)
                    break
                case 'Recent First':
                    e.sort(this.$sourcerySorts.sortByTimePropertyDesc)
                    break
                case 'User':
                    e = this.$sourcerySorts.sortGroupedByProp(e, 'user_id')
                    break
                default:
                    break
                }
            }

            return e
        }
    },
    methods: {
        eventText (event) {
            const description = event.description
                .replace('%s', event.status?.name)

            let userReplaceString = ''

            if (event.user) {
                if (event.user.name) {
                    userReplaceString = event.user.name
                }

                if (event.user.id === this.request.repository?.organization?.owner_id) {
                    if (userReplaceString) {
                        userReplaceString += ' (Vendor)'
                    } else {
                        userReplaceString += 'Vendor'
                    }
                } else if (event.user.id === this.request.user_id) {
                    if (userReplaceString) {
                        userReplaceString += ' (Client)'
                    } else {
                        userReplaceString += 'Client'
                    }
                }
            }

            if (!userReplaceString) {
                userReplaceString = 'User'
            }

            return description.replace('%u', userReplaceString)
        }
    }
}
</script>

<style scoped>
.event-scroller {
    border: 2px solid #3b3b3b;
    border-radius: 5px;
}

.sourcery-simple-table td {
    border-bottom: none!important;
}

.sourcery-simple-table th {
    box-shadow: none!important;
}
</style>
