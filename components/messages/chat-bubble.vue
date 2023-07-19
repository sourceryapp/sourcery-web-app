<template>
  <div :class="chatMessageClass">
    <div v-if="!isUser" class="pa-3 rounded-circle user-bubble">
      <v-icon>mdi-account-supervisor</v-icon>
    </div>
    <div :class="chatMessageTextClass">
      {{ message.content }}
    </div>
    <div v-if="isUser" class="pa-3 rounded-circle user-bubble">
      <v-icon>mdi-account</v-icon>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        message: {
            type: Object,
            default: () => {}
        },
        userId: {
            type: String,
            default: ''
        }
    },
    computed: {
        isUser () {
            return this.message.user_id === this.userId
        },
        chatMessageClass () {
            let class_string = 'chat-card-message'
            if (this.isUser) {
                class_string += ' alt-right'
            }
            return class_string
        },
        chatMessageTextClass () {
            let class_string = 'chat-card-message-text'
            if (this.isUser) {
                class_string += ' alt-purple'
            }
            if (this.sending) {
                class_string += ' might-be-faded'
            }
            return class_string
        },
        senderInitials () {
            return 'KB'
        }
    }
}
</script>
