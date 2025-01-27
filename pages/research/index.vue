<script setup>
const { requests: completedRequests,
    owned: completedOwned,
    limit: completedLimit,
    selectedStatus: completedStatus,
    fetchRequests: completedFetchRequests } = useRequestSearch()

const { requests: remainingRequests,
    owned: remainingOwned,
    limit: remainingLimit,
    selectedStatus: remainingStatus,
    fetchRequests: remainingFetchRequests } = useRequestSearch()

completedLimit.value = 5
completedOwned.value = true
completedStatus.value = ['STATUS_COMPLETE']

remainingLimit.value = 20
remainingOwned.value = true
remainingStatus.value = ['STATUS_CREATED', 'STATUS_PAID']

await completedFetchRequests()
await remainingFetchRequests()
</script>

<template>
    <div class="page">
        <v-container>
            <v-row align="end" class="mb-1">
                <v-col><h1 class="text-h6">Recently Completed</h1></v-col>
                <v-col cols="auto">
                    <v-btn size="small" append-icon="mdi-archive" variant="outlined" color="primary" :disabled="completedRequests.length === 0">Archive All
                        <template v-slot:append>
                            <v-icon color="primary"></v-icon>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
            
    
            <p v-if="completedRequests.length === 0">No recently completed requests.</p>
            <template v-for="request in completedRequests">
                <requests-card-small :request="request"></requests-card-small>
            </template>

            <v-row align="end" class="mb-1 mt-5">
                <v-col><h1 class="text-h6">Other Requests</h1></v-col>
                <v-col cols="auto"></v-col>
            </v-row>
    
            <p v-if="remainingRequests.length === 0">No other requests.</p>
            <template v-for="request in remainingRequests">
                <requests-card-small :request="request"></requests-card-small>
            </template>
        </v-container>
    </div>
</template>