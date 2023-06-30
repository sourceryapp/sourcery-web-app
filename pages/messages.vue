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
          <messages-chat-list-item v-for="chat in chats" :key="`chat-brief-${chat.id}`" :chat="chat" @selected-chat="chatSelected" />
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
            <p>Chat stuff here.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
    data () {
        return {
            chats: [
                {
                    id: 1,
                    title: 'A super long title of someones name',
                    body: 'A really long message body to test the overflow of the text',
                    date: '2020-01-01',
                    messages: []
                }
            ],
            selectedChat: null
        }
    },
    computed: {
        chatTitleName () {
            if (this.selectedChat) {
                return this.selectedChat.title
            }
            return 'Create Chat'
        },
        viewRequestAction () {
            if (this.selectedChat) {
                return '/request/' + this.selectedChat.id
            }
            return '#'
        }
    },
    methods: {
        chatSelected (chat) {
            this.selectedChat = chat
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
