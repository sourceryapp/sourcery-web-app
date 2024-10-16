<script setup>
const props = defineProps(['request'])
const emit = defineEmits(['released'])
const { request: managedRequest, releaseRequest } = useManageUriRequest()
managedRequest.value = props.request

const loading = ref(false)

async function release() {
    console.log('Releasing request', props.request)
    loading.value = true
    const result = await releaseRequest()
    if ( result ) {
        emit('released')
    }
}
</script>


<template>
    <div>
        <v-btn color="warning" size="x-large" variant="tonal" @click="release" :disabled="loading">Release Request</v-btn>
    </div>
</template>
