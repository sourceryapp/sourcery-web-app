<template>
    <div class="request-messenger">
        <v-alert title="Keep it Civil!" type="warning" variant="tonal" class="mb-3" v-if="civilAlert">
            <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.  By messaging with experts, you understand that you will not get an immediate response, and agree to treat experts with respect or subject your account to ban.</p>

            <v-btn variant="text" color="warning" @click="civilAlert = false">I agree</v-btn>
        </v-alert>
        <pre>{{ messages }}</pre>
    </div>
</template>

<script setup>
const props = defineProps(['request'])
const { messages, getMessages, sendMessage } = useRequestMessenger(props.request)
const civilAlert = defineModel({ type: Boolean, default: true })

await getMessages()
</script>