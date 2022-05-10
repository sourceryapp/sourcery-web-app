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
        </v-list-item>
        <v-card-text v-if="!minimized" class="overflow-y-scroll cap-height">
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
            sending: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            open: 'supabaseChat/isOpen',
            minimized: 'supabaseChat/isMinimized',
            request: 'supabaseChat/request',
            messages: 'supabaseChat/messages',
            organization: 'supabaseChat/organization'
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
    methods: {
        ...mapMutations({
            clear: 'supabaseChat/clear',
            setOpen: 'supabaseChat/setOpen',
            setMinimized: 'supabaseChat/setMinimized'
        }),
        ...mapActions({
            sendChatMessage: 'supabaseChat/sendMessage'
        }),
        toggleOpen () {
            this.setOpen(!this.open)
        },
        toggleMinimize () {
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
            return class_string
        },
        async sendMessage () {
            this.sending = true
            console.log('New Message:', this.newMessage)
            await this.sendChatMessage({
                vendor: this.isVendor,
                messageText: this.newMessage
            })

            this.newMessage = ''
            this.sending = false
        },
        close () {
            this.clear()
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

</style>
