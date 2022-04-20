<template>
  <div class="chat-card-viewport">
    <div class="chat-card-container">
      <v-card max-width="500" class="chat-card">
        <v-list-item two-line class="chat-card-title-bar">
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ chatTitle }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ chatSubtitle }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="toggleMinimize">
              <v-icon>{{ icon }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-card-text>
          <div class="chat-card-messages">
            <div v-for="message in messages" :key="message.id" :class="chatMessageClass(message)">
              <div :class="chatMessageTextClass(message)">
                {{ message.text }}
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            open: true,
            minimized: false,
            request: {},
            messages: [{
                id: 1,
                text: 'This is a message!',
                user_id: 1
            }, {
                id: 2,
                text: 'This is a response!',
                user_id: 2
            }]
        }
    },
    computed: {
        icon () {
            if (this.minimized) {
                return 'mdi-close'
            }
            return 'mdi-chevron-up'
        },
        chatTitle () {
            return 'Chat with an Archivist'
        },
        chatSubtitle () {
            if (this.request && this.request.id) {
                return `Request ${this.request?.id} - ${this.request?.repository.name}`
            }
            return 'Request ### - Repository Name'
        }
    },
    methods: {
        toggleOpen () {
            this.open = !this.open
        },
        toggleMinimize () {
            this.minimized = !this.minimized
        },
        chatMessageClass (message) {
            let class_string = 'chat-card-message'
            if (message.user_id !== 1) {
                class_string += ' alt-right'
            }
            return class_string
        },
        chatMessageTextClass (message) {
            let class_string = 'chat-card-message-text'
            if (message.user_id !== 1) {
                class_string += ' alt-purple'
            }
            return class_string
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

            .chat-card-title-bar {
              background: linear-gradient(45deg, #654EA3, #431A5A);
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

</style>
