<script setup>
definePageMeta({
    middleware: ["sourcerer"],
})

const { location, googleMapsEmbedUrl } = useLocation()

const { requests: openRequests,
    servicable: openServicable,
    selectedStatus: openStatus,
    fetchRequests: openFetchRequests } = useRequestSearch()

openServicable.value = true
openStatus.value = ['STATUS_CREATED']

await openFetchRequests()
</script>

<template>
    <div class="page">
        <v-container>
            <v-row v-if="location" align="center">
                <v-col>
                    <h1 class="text-h6 mb-1">Your Claim Location</h1>
                    <p class="mb-0">{{ location.lat }}, {{ location.lng }}</p>
                </v-col>
                <v-col cols="auto">
                    <v-btn color="secondary" to="/sourcerer/verify">Change</v-btn>
                </v-col>
                
            </v-row>

            <iframe v-if="googleMapsEmbedUrl" width="500" height="400" :src="googleMapsEmbedUrl" frameborder="0" loading="lazy" class="w-100 mb-4 mt-4" style="pointer-events: none"></iframe>

            <h1 class="text-h6 mb-1">Claim Request</h1>
            <p>Claim a request in your area to begin fulfillment.</p>

            <template v-for="request in openRequests">
                <requests-card-small :request="request" :price="true"></requests-card-small>
            </template>
        </v-container>
    </div>
</template>