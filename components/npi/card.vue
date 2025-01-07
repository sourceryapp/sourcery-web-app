<template>
    <v-sheet elevation="1" class="bg-surface-variant mb-6 py-4 px-6">
        <v-row justify="start" align="center" class="mb-4">
            <v-col cols="12" md="auto">
                <StatusChip :status="request.status"></StatusChip>
            </v-col>
            <v-col cols="12" md="auto" class="text-break">
                <span class="text-body-2 d-block">{{ request.repository_name }} - {{ request.repository_location }}</span>
                <span class="text-body-2 d-block text-muted"><em>Created: {{ $filters.normalDate(request.created_at) }}</em></span>
            </v-col>
        </v-row>
        <h3 class="text-break">{{ request.title ?? request.original_title }}</h3>
        <p class="text-break">{{ request.description ?? request.citation }}</p>
        <v-divider class="mb-4"></v-divider>
        <div class="d-flex align-center justify-start flex-wrap">
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
            <v-btn color="info" variant="text" :to="`/request/${request.id}#actions`" class="me-2 mb-2">Claim Request</v-btn>
        </div>
    </v-sheet>
</template>

<script setup>
const props = defineProps(['request'])
const emit = defineEmits(['deleted', 'claimed'])

const { request: managedRequest, claimRequest, deleteRequest, canManage } = useManageUriRequest()

const deleteRequestDialog = ref(false)

managedRequest.value = props.request

async function deleteNpi() {
    managedRequest.value = props.request
    await deleteRequest()
    deleteRequestDialog.value = false
    emit('deleted')
}
</script>