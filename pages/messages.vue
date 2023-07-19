<template>
  <div class="messages-page w-100 h-100 px-2">
    <v-row class="h-100 mxh-85v align-stretch pos-r">
      <v-col cols="4" class="h-100">
        <v-card flat tile class="h-100 rounded-lg grey darken-4">
          <div class="d-flex justify-space-between align-center flex-no-wrap">
            <v-card-title>Messages</v-card-title>
            <v-btn
              v-show="createEnabled"
              fab
              icon
              dark
              color="primary"
              @click="resetSelectedChat"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </div>
          <messages-chat-list-item v-for="chat in requests" :key="`chat-brief-${chat.request.id}`" :chat="chat" @selected-chat="chatSelected" />
        </v-card>
      </v-col>
      <v-col cols="8" class="d-flex flex-column h-100">
        <v-card flat tile class="mb-6 rounded-lg grey darken-4 flex-grow-2">
          <div class="d-flex justify-space-between align-center flex-no-wrap">
            <div class="">
              <v-card-title class="text-h4 font-weight-bold pb-1">
                {{ chatTitleName }}
              </v-card-title>
              <v-card-text class="text-uppercase">
                <span>{{ chatSubtitleText }}</span><br>
                <span v-show="chatMetaText">Request Created {{ chatMetaText | normalDate }}</span>
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
        <v-card flat tile class="rounded-lg grey darken-4 mh-0 pos-r flex-grow-1">
          <v-card-text class="d-flex flex-column h-100 justify-end">
            <p v-if="!selectedChat" class="text-h6">
              Select a chat to view messages.
            </p>
            <div ref="messagesContainer" class="chat-card-messages overflow-y-auto px-4 mh-0">
              <messages-chat-bubble v-for="message in messages" :key="`messagebubble-${message.id}`" :user-id="user.id" :message="message" />
            </div>
            <div v-show="selectedChat" class="chat-form mt-4">
              <v-form ref="chatForm" v-model="newChatTextForm" lazy-validation>
                <v-textarea
                  v-model="newChatText"
                  :counter="500"
                  :rules="[v => !!v || 'Message is required']"
                  label="Message"
                  required
                  outlined
                  rows="1"
                  class="mb-2"
                  validate-on-blur
                  @blur="() => $refs.chatForm.resetValidation()"
                />
                <v-btn
                  color="primary"
                  class="px-4 py-2"
                  @click="sendMessage"
                >
                  Send
                </v-btn>
              </v-form>
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
import { Repository } from '~/models/Repository'

export default {
    async asyncData () {
        const requests = await Request.getRequestsWithMessages()
        const repositories = [
            ...await Repository.getActive(),
            ...await Repository.getGhost()
        ]
        requests.forEach((request) => {
            request.repository = repositories.find((repo) => {
                return repo.id === request.request.repository_id
            })
        })
        return {
            requests
        }
    },
    data () {
        return {
            requests: [],
            selectedChat: null,
            loading: false,
            newChatTextForm: null,
            newChatText: '',
            createEnabled: false
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
            return this.createEnabled ? 'Create Chat' : 'Select Chat'
        },
        chatSubtitleText () {
            if (this.selectedChat) {
                return this.selectedChat.repository?.name
            }
            return ''
        },
        chatMetaText () {
            if (this.selectedChat) {
                return this.selectedChat.request.created_at
            }
            return ''
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
            if (c.length > 0) {
                // Array.from({ length: 20 }, (_, i) => i + 1).forEach((i) => {
                //     c.push({
                //         id: i,
                //         request_id: 1,
                //         user_id: 1,
                //         content: 'This is a test message',
                //         created_at: '2021-01-01 00:00:00'
                //     })
                // })
                this.$nextTick(() => {
                    this.scrollToBottom()
                })
            }

            return c
        }
    },
    methods: {
        chatSelected (chat) {
            console.log('chat selected!')
            chat.comments = []
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
        },
        scrollToBottom () {
            this.$refs.messagesContainer.scrollTop = 9999999999
        },
        sendMessage () {
            if (!this.$refs.chatForm.validate()) {
                return
            }
            console.log('sending', this.newChatText, this.newChatTextForm)
            // const newComment = new RequestComment({
            //     request_id: this.selectedChat.request.id,
            //     user_id: this.user.id,
            //     comment: this.newChatText
            // })
            // newComment.save().then((comment) => {
            //     this.selectedChat.comments.push(comment)
            //     this.newChatText = ''
            // })
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
.mh-0 {
    min-height: 0;
}
.mxh-85v {
    max-height: 85vh;
}
.pos-r {
  position: relative;
}
</style>
