<template>
    <v-sheet elevation="1" class="bg-surface-variant mb-6 py-4 px-6 request-card">
        <v-row justify="start" align="center" class="mb-4">
            <v-col cols="12" md="auto">
                <StatusChip :status="request.status"></StatusChip>
            </v-col>
            <v-col cols="12" md="auto">
                <span class="text-body-2 d-block">{{ request.repository.name }} - {{ request.repository.organization.name }}</span>
                <span class="text-body-2 d-block text-muted"><em>Created: {{ $filters.normalDate(request.created_at) }}, Last Updated: {{ $filters.normalDate(request.updated_at) }}</em></span>
            </v-col>
        </v-row>
        <h3>{{ request.vendor_label ?? request.client_label ?? request.original_title ?? 'Untitled' }}</h3>
        <p>{{ citation }}</p>
        <v-divider class="mb-4"></v-divider>
        <div class="d-flex align-center justify-start">
            <v-btn color="primary" variant="text" border="0" :to="`/request/${request.id}`" class="mb-2 me-2">View Request</v-btn>
            <v-btn color="primary" variant="text" border="0" class="mb-2" :to="`/request/${request.id}#messages`" v-if="['STATUS_UNPAID', 'STATUS_PAID', 'STATUS_COMPLETE'].includes(request.status)">Open Discussion</v-btn>
        </div>
    </v-sheet>
</template>

<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const props = defineProps(['request'])

const citation = computed(() => {
    let max = mobile ? 100 : 300
    let c = props.request.citation.substring(0, max)
    return props.request.citation.length > max ? c + '...' : c
})
</script>

<style lang="scss" scoped>
.request-card {
    word-wrap: break-word;
}
</style>