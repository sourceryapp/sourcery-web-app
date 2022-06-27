<template>
  <v-container>
    <v-flex xs12 sm10 offset-sm-1>
      <v-row class="mb-3">
        <v-col>
          <button-transparent to="/dashboard" text="Return to Dashboard" icon="mdi-arrow-left-thin" />
        </v-col>
      </v-row>
      <h1 class="mb-4">
        Receipt Tester
      </h1>

      <v-row>
        <v-col cols="12" md="6">
          <card-with-header :title="cardTitle">
            <v-card-text class="py-4">
              <button-download text="Download Files" :request="request" />
            </v-card-text>
            <v-card-text>
              <div class="mb-4">
                <h3>Repository:</h3>
                <p>{{ request.repository.name }}</p>
              </div>
              <div class="mb-4">
                <h3>Date Submitted:</h3>
                <p>{{ dateCreated }}</p>
              </div>
              <div class="mb-4">
                <h3>Date Completed:</h3>
                <p>Unknown</p>
              </div>
              <div class="mb-4">
                <h3>Your Citation:</h3>
                <p>{{ request.citation }}</p>
              </div>
            </v-card-text>
          </card-with-header>
        </v-col>
        <v-col cols="12" md="6">
          <card-with-header :title="messagesCardTitle">
            <v-card-text>
              <chat-list :request="request" />
            </v-card-text>
          </card-with-header>

          <card-with-header title="Archive's Citation(s)">
            <v-card-text class="py-3">
              <copy-text-box :text="request.archive_citation" />
            </v-card-text>
          </card-with-header>

          <button-large text="Print History and Citations" to="/" />
        </v-col>
      </v-row>
    </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { Request } from '~/models/Request'
import { RequestComment } from '~/models/RequestComment'

export default {
    async asyncData () {
        // const request = await Request.getById(20)
        const request = await Request.getById(22)
        const messageCount = await RequestComment.countForRequest(request)
        return {
            request,
            messageCount
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        dateCreated () {
            const d = new Date(this.request.created_at)
            return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
        },
        isClient () {
            return this.request.user_id === this.user.id
        },
        cardTitle () {
            if (this.isClient) {
                return this.request.request_client.label
            }
            return this.request.request_vendor.label
        },
        messagesCardTitle () {
            return `Message History (${this.messageCount})`
        }
    }
}
</script>
