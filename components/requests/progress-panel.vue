<template>
    <v-list rounded elevation="4" class="py-3 pb-4">
        <v-list-subheader>Request Progress</v-list-subheader>

        <v-list-item class="py-3 pb-4">
            <template v-slot:prepend>
                <v-icon size="large" color="success">mdi-check</v-icon>
            </template>
            <v-list-item-title>Submitted</v-list-item-title>
            <v-list-item-subtitle><em>{{ $filters.normalDate(request.created_at) }}</em></v-list-item-subtitle>
        </v-list-item>

        <template v-if="isCancelled">
            <v-list-item class="py-3 pb-4" active>
                <template v-slot:prepend>
                    <v-icon size="large" color="error">mdi-close</v-icon>
                </template>
                <v-list-item-title>Cancelled</v-list-item-title>
                <v-list-item-subtitle><em>{{ $filters.normalDate(cancelledDate) }}</em></v-list-item-subtitle>
            </v-list-item>
        </template>

        <template v-else>
            <v-list-item class="py-3 pb-4" :active="isUnassigned || (isPublic && !isClaimed)">
                <template v-slot:prepend>
                    <v-icon size="large" color="orange" v-if="isUnassigned || (isPublic && !isClaimed)">mdi-clock-outline</v-icon>
                    <v-icon size="large" color="success" v-else>mdi-check</v-icon>
                </template>
                <v-list-item-title>
                    <span v-if="isUnassigned">Waiting for Assignment</span>
                    <span v-else-if="isPublic && !isClaimed">Waiting for Claim</span>
                    <span v-else>{{ isClaimed ? 'Claimed' : 'Assigned'}}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                    <em v-if="isUnassigned">Currently Here</em>
                    <em v-else-if="(isPublic && !isClaimed)">This request is publicly listed for claim.</em>
                    <em v-else>{{ $filters.normalDate(isClaimed ? request.servicer_claimed_at : submittedDate) }}</em>
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="py-3 pb-4" :active="isSubmitted" :disabled="isUnassigned || (isPublic && !isClaimed)">
                <template v-slot:prepend>
                    <v-icon size="large" color="orange" v-if="isSubmitted">mdi-clock-outline</v-icon>
                    <v-icon size="large"  v-else-if="isUnassigned || (isPublic && !isClaimed)">mdi-dots-horizontal</v-icon>
                    <v-icon size="large" color="success" v-else>mdi-check</v-icon>
                </template>
                <v-list-item-title>
                    <span v-if="isSubmitted">{{ isClaimed ? 'Servicing' : 'Waiting for Confirmation' }}</span>
                    <span v-else>Confirmed</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                    <em v-if="isSubmitted">Currently Here</em>
                    <em v-else-if="isUnassigned || (isPublic && !isClaimed)">Awaiting Assignment</em>
                    <em v-else>{{ $filters.normalDate(confirmedDate) }}</em>
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="py-3 pb-4" :active="isInProgress" :disabled="isSubmitted || isUnassigned">
                <template v-slot:prepend>
                    <v-icon size="large" color="orange" v-if="isInProgress">mdi-clock-outline</v-icon>
                    <v-icon size="large"  v-else-if="isSubmitted || isUnassigned">mdi-dots-horizontal</v-icon>
                    <v-icon size="large" color="success" v-else>mdi-check</v-icon>
                </template>
                <v-list-item-title>
                    <span v-if="isInProgress">Being Serviced</span>
                    <span v-else>Completed</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                    <em v-if="isInProgress">Currently Here</em>
                    <em v-else-if="isCompleted || isArchived">{{ $filters.normalDate(completedDate) }}</em>
                    <em v-else>Awaiting Confirmation</em>
                </v-list-item-subtitle>
            </v-list-item>
        </template>

        <template v-if="isArchived">
            <v-list-item class="py-3 pb-4">
                <template v-slot:prepend>
                    <v-icon size="large">mdi-archive</v-icon>
                </template>
                <v-list-item-title>Archived</v-list-item-title>
                <v-list-item-subtitle><em>{{ $filters.normalDate(archivedDate) }}</em></v-list-item-subtitle>
            </v-list-item>
        </template>
    </v-list>
</template>

<script setup>
const props = defineProps(['request'])

const { 
    request,
    isSubmitted, isInProgress, isCompleted, isArchived, isCancelled, isUnassigned, isPublic, isClaimed,
    confirmedDate, completedDate, archivedDate, cancelledDate, submittedDate
} = useFetchRequest(props.request)
</script>