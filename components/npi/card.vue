<template>
    <v-sheet elevation="1" class="bg-surface-variant mb-6 py-4 px-6">
        <v-row justify="start" align="center" class="mb-4">
            <v-col cols="12" md="auto">
                <StatusChip :status="request.status"></StatusChip>
            </v-col>
            <v-col cols="12" md="auto">
                <span class="text-body-2 d-block">{{ request.repository_name }} - {{ request.repository_location }}</span>
                <span class="text-body-2 d-block text-muted"><em>Created: {{ $filters.normalDate(request.created_at) }}</em></span>
            </v-col>
        </v-row>
        <h3>{{ request.title ?? request.original_title }}</h3>
        <p>{{ request.description ?? request.citation }}</p>
        <v-divider class="mb-4"></v-divider>
        <div class="d-flex align-center justify-start">
            <v-btn v-if="request.status_id !== 6" variant="text" border="0" color="primary" class="me-2 mb-2" :to="`/request/${request.id}`">View Request</v-btn>
            <v-dialog v-model="deleteRequestDialog" max-width="500" v-if="!request.deleted && canManage">
                <template v-slot:activator="{ props }">
                    <v-btn color="error" variant="text" border="0" v-bind="props" class="mb-2 me-2" v-if="!request.deleted">Delete Request</v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                    <v-card>
                        <v-card-title>Delete Request</v-card-title>
                        <v-card-text>
                            <p>Are you sure you want to delete this request?</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="error" @click="deleteNpi">Delete</v-btn>
                            <v-btn @click="isActive.value = false" text>Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
            <v-dialog v-model="claimRequestDialog" max-width="500" v-if="canClaim">
                <template v-slot:activator="{ props }">
                    <v-btn color="info" variant="text" v-bind="props" class="me-2 mb-2">Claim Request</v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                    <v-card>
                        <v-card-title>Claim Request</v-card-title>
                        <v-card-text>
                            <p>Are you sure you want to claim this request? You will have 48 hours to service this request before it will be returned to the claim pool.</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="info" @click="claimNpi">Claim</v-btn>
                            <v-btn @click="isActive.value = false" text>Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </div>
    </v-sheet>
</template>

<script setup>
const props = defineProps(['request'])
const emit = defineEmits(['deleted', 'claimed'])

const { request: managedRequest, claimRequest, deleteRequest, canManage, canClaim } = useManageUriRequest()

const deleteRequestDialog = ref(false)
const claimRequestDialog = ref(false)

managedRequest.value = props.request

const status = computed(() => {
    if ( props.request.deleted ) {
        return { name: 'Cancelled' }
    }

    if ( props.request.converted ) {
        return { name: 'Converted' }
    }

    return { name: 'Unassigned' }
})


async function deleteNpi() {
    managedRequest.value = props.request
    await deleteRequest()
    deleteRequestDialog.value = false
    emit('deleted')
}

async function claimNpi() {
    console.log('Claiming request', props.request)
    const result = await claimRequest()
    if ( result ) {
        claimRequestDialog.value = false
        emit('claimed')
        navigateTo('/request/' + props.request.id)
    }
}
</script>