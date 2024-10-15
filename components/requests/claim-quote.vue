<script setup>
const props = defineProps(['request'])
const emit = defineEmits(['claimed'])
const { authUser } = useAuthUser()
const { request: managedRequest, claimRequest, deleteRequest, canManage, canClaim, pricing } = useManageUriRequest()

managedRequest.value = props.request

const loading = ref(false)

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
        <v-radio-group v-model="pricing">
            <v-radio label="Free ($0.00)" value="PRICING_FREE"></v-radio>
            <v-radio label="Small ($10.00)" value="PRICING_SMALL"></v-radio>
            <v-radio label="Medium ($25.00)" value="PRICING_MEDIUM"></v-radio>
            <v-radio label="Large ($50.00)" value="PRICING_LARGE"></v-radio>
        </v-radio-group>

        <v-alert color="warning" icon="$warning" variant="tonal" class="mb-4" v-if="pricing !== 'free'" title="Payment Action" text="The requesting user will be required to pay for the invoice before receiving documents.  You must add a payout account to receive funds."></v-alert>

        <v-btn color="info" size="x-large" variant="tonal" @click="claim" :disabled="loading">Claim Request & Confirm Pricing</v-btn>
    </div>
</template>
