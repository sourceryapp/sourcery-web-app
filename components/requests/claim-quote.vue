<script setup>
const props = defineProps(['request'])
const emit = defineEmits(['claimed'])
const { authUser } = useAuthUser()
const { request: managedRequest, claimRequest, deleteRequest, canManage, canClaim, pricing } = useManageUriRequest()

managedRequest.value = props.request

// Placeholders
const totalPrice = computed(() => {
    return ((managedRequest.value.pages * 0.4) + 10) * 100
})

async function claim() {
    console.log('Claiming request', props.request)
    loading.value = true
    const result = await claimRequest()
    if ( result ) {
        emit('claimed')
    }
}
</script>


<template>
    <div>
        <v-row align="center" class="py-3">
            <v-col>
                <span class="d-block">{{ managedRequest.pages }} pages</span>
                <!-- Placeholder PRicing -->
                <span class="text-h3">{{ $utils.currencyFormat(totalPrice - (totalPrice * 0.1)) }}</span>
            </v-col>
        </v-row>
        

        <v-alert color="warning" icon="$warning" variant="tonal" class="mb-4" v-if="pricing !== 'free'" title="Payment Action" text="The requesting user will be required to pay for the invoice before receiving documents.  You must add a payout account to receive funds."></v-alert>

        <v-btn color="info" size="x-large" variant="tonal" @click="claim" :disabled="loading">Claim Request & Confirm Pricing</v-btn>
    </div>
</template>
