<template>
    <div class="request-list">
        <v-list lines="three">
            <RequestListItem v-for="request in requests" :request="request"></RequestListItem>
            <p v-if="requests.length === 0">No requests.</p>
        </v-list>
    </div>
</template>

<script setup>
const { requests, fetchRequests } = useFetchRequests()

await fetchRequests()
</script>