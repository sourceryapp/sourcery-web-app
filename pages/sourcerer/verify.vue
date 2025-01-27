<script setup>
definePageMeta({
    middleware: ["sourcerer"],
})

const { location, locationError, popularLocations, getUserLocation, setLocation } = useLocation()
const payoutAccountLinked = ref(true)

const canContinue = computed(() => {
    return location.value !== null && payoutAccountLinked.value
})
</script>

<template>
    <div class="page text-center">
        <v-container>
            <h1 class="mb-3">Verifying Sourcerer Status</h1>
            <v-progress-circular
                color="primary"
                indeterminate
                size="large"
                class="mb-7"
                ></v-progress-circular>
            <div class="verify-account mb-7">
                <p class="font-weight-bold">Please verify you have a connected payout account.</p>
                <div class="d-flex align-center">
                    <v-icon :color="payoutAccountLinked ? 'green' : 'red'">{{ payoutAccountLinked ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                    <span class="ms-2">{{ payoutAccountLinked ? 'Account Linked' : 'Account Not Linked' }}</span>
                </div>
            </div>

            <div class="verify-location mb-7">
                <p class="font-weight-bold">Connect your location to see relevant requests to fulfill, or select from a popular location:</p>
                <v-btn @click="getUserLocation()" class="mb-3">Verify Location</v-btn>
                <v-alert v-if="location">
                    <v-icon color="green">mdi-check-circle</v-icon> Current Location: {{ location.lat }}, {{ location.lng }}
                </v-alert>
                <template v-if="locationError">
                    <p>We're having trouble getting a location on this device.  Try again or select from a popular US location.</p>
                    <v-btn v-for="(cities, name) in popularLocations" @click="setLocation(name)" class="ma-2">{{ name }}</v-btn>
                </template>
            </div>

            <v-btn color="primary" to="/sourcerer" size="large" v-if="canContinue">Continue</v-btn>
        </v-container>
        
    </div>
</template>