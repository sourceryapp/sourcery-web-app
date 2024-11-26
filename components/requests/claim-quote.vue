<script setup>
const props = defineProps(['request'])
const emit = defineEmits(['claimed'])
const { authUser } = useAuthUser()
const { request: managedRequest, claimRequest, totalPrice } = useManageUriRequest()

managedRequest.value = props.request
const loading = ref(false)
const claimDialog = ref(false)

async function claim() {
    console.log('Claiming request', props.request)
    loading.value = true
    const result = await claimRequest()
    if ( result ) {
        emit('claimed')
    }
    loading.value = false
}
</script>


<template>
    <div>
        <v-row align="center" class="py-3">
            <v-col>
                <span class="d-block">{{ managedRequest.pages }} pages</span>
                <!-- Placeholder Pricing -->
                <span class="text-h3">{{ $utils.currencyFormat(totalPrice - (totalPrice * 0.1)) }}</span>
            </v-col>
        </v-row>
        

        <v-alert color="warning" icon="$warning" variant="tonal" class="mb-4" v-if="pricing !== 'free'" title="Payment Action" text="The requesting user will be required to pay for the invoice before receiving documents.  You must add a payout account to receive funds."></v-alert>

        <v-btn color="info" size="x-large" variant="tonal" @click="claimDialog = true" :disabled="loading">Claim Request & Confirm Pricing</v-btn>

        <v-dialog v-model="claimDialog">
            <v-card>
                <v-card-title>Claim Request</v-card-title>
                <v-card-text :class="{ 'text-center': loading }">
                    <div v-if="!loading">
                        <p>Are you sure you want to claim this request?</p>
                        <p>By claiming this request, you are committing to fulfill the request and deliver the documents to the user.  Requests without resolution within 48 hours will be released back to the public pool to be reclaimed.</p>
                    </div>
                    <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" @click="claimDialog = false" :disabled="loading">Cancel</v-btn>
                    <v-btn color="primary" @click="claim" :disabled="loading">Claim Request</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
