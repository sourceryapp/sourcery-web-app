<template>
  <div class="messages-page w-100 h-100 px-2">
    <v-row class="h-100">
      <v-col cols="4">
        <v-card flat tile class="h-100 rounded-lg grey darken-4">
          <div class="d-flex justify-space-between align-center flex-no-wrap">
            <v-card-title>Messages</v-card-title>
            <v-btn fab icon dark color="primary" @click="resetSelectedChat">
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </div>
          <messages-chat-list-item v-for="chat in requests" :key="`chat-brief-${chat.request.id}`" :chat="chat" @selected-chat="chatSelected" />
        </v-card>
      </v-col>
      <v-col cols="8" class="d-flex flex-column">
        <v-card flat tile class="mb-6 rounded-lg grey darken-4">
          <div class="d-flex justify-space-between align-center flex-no-wrap">
            <div class="flex-grow-1">
              <v-card-title class="text-h4 font-weight-bold pb-1">
                {{ chatTitleName }}
              </v-card-title>
              <v-card-text class="text-uppercase">
                <span>Institution/Location of User</span><br>
                <span>Request # - "Title"</span>
              </v-card-text>
            </div>
            <div>
              <v-card-actions>
                <v-btn v-show="selectedChat !== null" outlined color="white" class="px-4 py-2 mr-2" :to="viewRequestAction">
                  View Request
                </v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
        <v-card flat tile class="flex-grow-1 rounded-lg grey darken-4">
          <v-card-text>
            <p v-if="!selectedChat">
              No chat selected.
            </p>
            <div class="chat-card-messages">
              <messages-chat-bubble v-for="message in messages" :key="`messagebubble-${message.id}`" :user-id="user.id" :message="message" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Request } from '~/models/Request'
import { RequestComment } from '~/models/RequestComment'

export default {
    async asyncData () {
        const requests = await Request.getRequestsWithMessages()
        return {
            requests
        }
    },
    data () {
        return {
            requests: [],
            selectedChat: null,
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        chatTitleName () {
            if (this.selectedChat) {
                return this.selectedChat.request.citation
            }
            return 'Create Chat'
        },
        viewRequestAction () {
            if (this.selectedChat) {
                return '/request/' + this.selectedChat.request.id
            }
            return '#'
        },
        messages () {
            const c = this.selectedChat?.comments || []
            c.reverse()
            return c
        }
    },
    methods: {
        chatSelected (chat) {
            console.log('chat selected!')
            chat.comments = []
            // this.selectedChat = chat
            this.loading = true
            if (this.selectedChat && this.selectedChat.request.id === chat.request.id) {
                this.loading = false
                return
            }
            RequestComment.getForRequest(chat.request).then((comments) => {
                console.log('requested!')
                const newSelected = chat
                newSelected.comments = comments
                this.selectedChat = newSelected
                this.loading = false
            })
        },
        resetSelectedChat () {
            this.selectedChat = null
        }
    }
}
</script>

<style>
.w-100 {
    width: 100%;
}
.h-100 {
    height: 100%;
}
</style>
