<template>
    <div class="request-messenger">
        <v-alert title="Keep it Civil!" type="warning" variant="tonal" class="mb-3" v-if="civilAlert">
            <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.  By messaging with experts, you understand that you will not get an immediate response, and agree to treat experts with respect or subject your account to ban.</p>

            <v-btn variant="text" color="warning" @click="civilAlert = false">I agree</v-btn>
        </v-alert>
        
        <div class="messenger-scroller position-relative">
            <pre>{{ messages }}</pre>
            <div v-for="message in messages" :class="{
                'request-message mb-2': true,
                'text-right': messageIsMine(message),
                'float-right': messageIsMine(message)
            }">
                <v-sheet class="py-3 px-5 d-inline-block" rounded="lg" elevation="1" :color="messageIsMine(message) ? 'primary' : 'surface-light'" width="auto">
                    <p class="text-caption mb-1"><em>{{ $filters.normalDate(message.created_at) }}</em></p>
                    {{ message.content }}
                </v-sheet>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['request', 'canService'])
const { messages, getMessages, sendMessage } = useRequestMessenger(props.request)
const civilAlert = defineModel({ type: Boolean, default: true })
const { authUser } = await useAuthUser()

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
        max-width: 70%;
        width: auto;
        // align-self: flex-start;
    }
}
</style>