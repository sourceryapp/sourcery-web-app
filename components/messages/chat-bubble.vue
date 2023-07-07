<template>
  <div :class="chatMessageClass">
    <div :class="chatMessageTextClass">
      {{ message.content }}
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
        chatMessageClass () {
            let class_string = 'chat-card-message'
            if (this.message.user_id === this.userId) {
                class_string += ' alt-right'
            }
            return class_string
        },
        chatMessageTextClass () {
            let class_string = 'chat-card-message-text'
            if (this.message.user_id === this.userId) {
                class_string += ' alt-purple'
            }
            if (this.sending) {
                class_string += ' might-be-faded'
            }
            return class_string
        }
    }
}
</script>
