<template>
    <div>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field label="Search" variant="outlined" v-model="search" @update:model-value="onModelChange" density="compact" prepend-inner-icon="mdi-magnify" hide-details></v-text-field>
            </v-col>
            <v-col md="4">
                <StatusSelect v-model="selectedStatus" @update:model-value="onModelChange"></StatusSelect>
            </v-col>
            <v-col md="4">
                <v-select v-model="order" :items="orderOptions" variant="outlined" clearable placeholder="Sort Order" label="Sort Order" @update:model-value="onModelChange" density="compact" hide-details></v-select>
            </v-col>
            <v-col cols="12">
                <v-progress-linear :active="loading" color="primary" height="10" indeterminate class="mb-4"></v-progress-linear>
            </v-col>
        </v-row>

        <template v-if="selectedStatus.includes(0)">
            <p>These requests were submitted to a location not yet registered with Sourcery. Not to worry - we're reaching out for you, but a response is not guaranteed.</p>
            <npi-card v-for="request in npiRequests" :request="request" :key="request.id"></npi-card>
        </template>

        <template v-else>
            <template v-for="request in requests" :key="request.id">
                <requests-card :request="request" v-if="request.repository"></requests-card>
                <npi-card :request="request" v-else @deleted="onModelChange"></npi-card>
            </template>
        </template>
        

        <div v-if="requests.length === 0" class="text-center">
            <div v-if="hasQuery">
                <p>No requests found for your search.</p>
            </div>
            <div v-else>
                <p v-if="props.organizationId">No requests here yet!</p>
                <p v-else>No requests here yet - let's <NuxtLink to="/request/create">create one</NuxtLink>!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const { requests, organizationId, owned, search, selectedStatus, order, loading, orderOptions, hasQuery, fetchRequests, onModelChange } = useRequestSearch()

const props = defineProps({
    organizationId: {
        type: Number,
        default: null
    }
})

// Required so parent can call this
defineExpose({
    setStatus
})

function setStatus(statusName) {
    selectedStatus.value = [statusName]
    onModelChange()
}

if ( props.organizationId ) {
    organizationId.value = props.organizationId
    owned.value = false
}

await fetchRequests()
</script>