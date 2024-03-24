<template>
    <div class="request-messenger">
        <v-alert title="Keep it Civil!" type="warning" variant="tonal" class="mb-3" v-if="civilAlert">
            <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.  By messaging with experts, you understand that you will not get an immediate response, and agree to treat experts with respect or subject your account to ban.</p>

            <v-btn variant="text" color="warning" @click="civilAlert = false">I agree</v-btn>
        </v-alert>
        
        <div class="messenger-scroller position-relative">
            <v-row v-for="message in messages" no-gutters class="request-message mb-4">
                <v-col>
                    <v-sheet :class="{
                        'request-message-sheet py-3 px-5 d-inline-block': true,
                        'float-right': messageIsMine(message)
                    }" rounded="lg" elevation="1" :color="messageIsMine(message) ? 'primary' : 'surface-light'" width="auto">
                        <p class="text-caption mb-1"><em>{{ $filters.normalDate(message.created_at) }}</em></p>
                        {{ message.content }}
                    </v-sheet>
                </v-col>
            </v-row>
        </div>

        <v-form class="new-message-form" @submit.prevent="sendMessage" v-model="messageFormValid" validate-on="submit" :disabled="messageFormLoading">
            <v-textarea
                v-model="message"
                label="New Message"
                placeholder="Type your message here..."
                variant="outlined"
                rows="3"
                class="mb-3"
                :rules="[$sourceryForms.rules.required, $sourceryForms.rules.largeTextAreaCounter]"
                counter="6000"
            ></v-textarea>

            <v-btn
                color="primary"
                type="submit"
            >Send</v-btn>
        </v-form>
    </div>
</template>

<script setup>
const props = defineProps(['request', 'canService'])
const {
    messageFormValid, messageFormLoading, messageFormError, message,
    messages, getMessages, sendMessage
} = useRequestMessenger(props.request)
const civilAlert = defineModel({ type: Boolean, default: true })
const { authUser } = useAuthUser()

function messageIsMine(message) {
    return message.user_id === authUser.value.id || (message.vendor && props.canService)
}

await getMessages()
</script>

<style lang="scss" scoped>
.messenger-scroller {
    height: 500px;
    max-height: 70vh;
    overflow-y: auto;
    .request-message {
        .request-message-sheet {
            max-width: 80%;
            width: auto;
        }
    }
}
</style>