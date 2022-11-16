<template>
  <div class="request-events">
    <v-list>
      <template v-for="(event, index) in events">
        <v-list-item
          :key="event.id"
        >
          <v-list-item-content>
            <v-list-item-title v-html="eventText(event)" />
            <v-list-item-subtitle>{{ event.created_at | normalDateAndTime }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index < (events.length - 1)" :key="`divider-${event.id}`" />
      </template>
    </v-list>
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
            events: []
        }
    },
    async fetch () {
        this.events = await RequestEvent.getForRequestId(this.request.id)
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
