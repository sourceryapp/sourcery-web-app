<script setup>
definePageMeta({
    middleware: ["sourcerer"],
})

const { requests: assignedRequests,
    servicing: assignedServicing,
    selectedStatus: assignedStatus,
    fetchRequests: assignedFetchRequests } = useRequestSearch()

assignedServicing.value = true
assignedStatus.value = ['STATUS_PAID']
await assignedFetchRequests()
</script>

<template>
    <div class="page">
        <v-container>
            <h1 class="text-h6 mb-1">Currently Assigned</h1>
            <p v-if="assignedRequests.length === 0">No requests assigned to you.</p>
            <template v-for="request in assignedRequests">
                <requests-card-small :request="request"></requests-card-small>
            </template>
        </v-container>
    </div>
</template>