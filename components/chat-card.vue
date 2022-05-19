<template>
  <div class="chat-card-viewport">
    <div v-if="open" class="chat-card-container">
      <v-card max-width="500" class="chat-card">
        <v-list-item two-line class="chat-card-title-bar">
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ chatTitle }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ chatSubtitle }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="nostack">
            <v-btn icon @click="toggleMinimize">
              <v-icon>{{ minimizeIcon }}</v-icon>
            </v-btn>
            <v-btn icon @click="close">
              <v-icon>{{ closeIcon }}</v-icon>
            </v-btn>
          </v-list-item-action>
          <div v-if="gotNewMessages" class="badge">
            <v-icon>mdi-shimmer</v-icon>
          </div>
        </v-list-item>
        <v-card-text v-show="!minimized" id="chatScroller" class="overflow-y-scroll cap-height">
          <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.</p>
          <div class="chat-card-messages">
            <div v-for="message in messages" :key="message.id" :class="chatMessageClass(message)">
              <div :class="chatMessageTextClass(message)">
                {{ message.content }}
              </div>
            </div>
          </div>
          <div v-if="messages.length === 0 && !vendorIsClient" class="no-messages">
            <p>There are currently no messages in this chat.  Send the first one below!  The recipient will receive an email when sent.</p>
          </div>
          <div v-if="vendorIsClient">
            <p>Client is the same user as the vendor, thus no need for chat.</p>
          </div>
        </v-card-text>
        <hr>
        <v-card-actions v-if="!minimized && !vendorIsClient" class="pt-5 px-4">
          <v-row>
            <v-col cols="10">
              <v-text-field v-model="newMessage" placeholder="Type a message here." dense filled rounded />
            </v-col>
            <v-col>
              <v-btn fab small :disabled="sendButtonDisabled" @click="sendMessage">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
    data () {
        return {
            newMessage: '',
            closeIcon: 'mdi-close',
            sending: false,
            newMessageWhileSending: ''
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            open: 'supabaseChat/isOpen',
            minimized: 'supabaseChat/isMinimized',
            request: 'supabaseChat/request',
            messages: 'supabaseChat/messages',
            organization: 'supabaseChat/organization',
            gotNewMessages: 'supabaseChat/gotNewMessages'
        }),
        isVendor () {
            if (this.organization) {
                return this.user.id === this.organization.owner_id
            }
            return false
        },
        vendorIsClient () {
            if (this.organization && this.request.user_id === this.organization.owner_id) {
                return true
            }
            return false
        },
        minimizeIcon () {
            if (this.minimized) {
                return 'mdi-chevron-up'
            }
            return 'mdi-chevron-down'
        },
        chatTitle () {
            if (this.isVendor) {
                return 'Chat with the Client'
            }
            return 'Chat with an Archivist'
        },
        chatSubtitle () {
            if (this.request && this.request.id) {
                if (this.isVendor && this.request.request_vendor) {
                    return `Request ${this.request.id} - ${this.request.request_vendor.label}`
                } else if (!this.isVendor && this.request.request_client) {
                    return `Request ${this.request.id} - ${this.request.request_client.label}`
                }
                return `Request ${this.request.id}`
            }
            return 'Loading Request #'
        },
        sendButtonDisabled () {
            return this.newMessage === '' || this.sending
        }
    },
    watch: {
        open: {
            handler (newVal, oldVal) {
                if (newVal) {
                    setTimeout(this.scrollToBottom, 100)
                }
            },
            flush: 'post'
        }
    },
    methods: {
        ...mapMutations({
            clear: 'supabaseChat/clear',
            setOpen: 'supabaseChat/setOpen',
            setMinimized: 'supabaseChat/setMinimized',
            setJustGotNewMessages: 'supabaseChat/setJustGotNewMessages'
        }),
        ...mapActions({
            sendChatMessage: 'supabaseChat/sendMessage'
        }),
        toggleOpen () {
            this.setJustGotNewMessages(false)
            this.setOpen(!this.open)
        },
        toggleMinimize () {
            this.setJustGotNewMessages(false)
            this.setMinimized(!this.minimized)
        },
        chatMessageClass (message) {
            let class_string = 'chat-card-message'
            if (message.user_id === this.user.id) {
                class_string += ' alt-right'
            }
            return class_string
        },
        chatMessageTextClass (message) {
            let class_string = 'chat-card-message-text'
            if (message.user_id === this.user.id) {
                class_string += ' alt-purple'
            }
            if (this.sending) {
                class_string += ' might-be-faded'
            }
            return class_string
        },
        async sendMessage () {
            this.newMessageWhileSending = this.newMessage
            this.newMessage = ''
            this.sending = true
            this.scrollToBottom()
            console.log('New Message:', this.newMessage)
            await this.sendChatMessage({
                vendor: this.isVendor,
                messageText: this.newMessageWhileSending
            })
            this.sending = false
            this.newMessageWhileSending = ''
            this.scrollToBottom()
        },
        close () {
            this.clear()
        },
        scrollToBottom () {
            const scrollerElement = document.getElementById('chatScroller')
            if (scrollerElement) {
                scrollerElement.scrollTop = 9999999999
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.chat-card-viewport {
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 99999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .chat-card-container {
        position: absolute;
        bottom: 0;
        right: 20%;
        z-index: 999999;
        pointer-events: auto;

        .chat-card {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            .chat-card-title-bar {
              background: linear-gradient(45deg, #654EA3, #431A5A);
            }

            .cap-height {
              max-height: 350px;
            }

            .overflow-y-scroll {
              overflow-y: auto;
            }

            .chat-card-message {
              margin-bottom: 15px;
              display: block;
              display: flex;
              justify-content: flex-start;
              &.alt-right {
                justify-content: flex-end;
              }
                .chat-card-message-text {
                background-color: #555455;
                color: white;
                padding: 10px 15px;
                border-radius: 15px;
                max-width: 70%;
                justify-self: left;
                &.alt-purple {
                  background-color: #654EA3;
                  text-align: right;
                }
                &.might-be-faded:last-child {
                  opacity: 0.8;
                }
              }
            }

        }
    }
}

.nostack {
  flex-direction: row;
}

hr {
  border-color: rgba(112, 112, 112, .62)
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: red;
  width: 20px;
  height: 20px;
  border-radius: 24px;

  i.v-icon {
    display: flex;
    width: 12px;
    height: 12px;
    font-size: 14px;
    margin: 4px;
    align-self: center;
    justify-self: center;
  }
}

</style>
