<template>
    <v-select
        v-model="selected"
        :items="statuses"
        label="Filter by Status"
        item-title="name"
        item-value="id"
        variant="outlined"
        multiple
        clearable
        hide-details
        placeholder="Filter by Status"
        density="compact"
    ></v-select>
</template>

<script setup>
const selected = defineModel()

const statuses = [
    { id: 'STATUS_CREATED', name: 'New' },
    { id: 'STATUS_PAID', name: 'In Progress (Unpaid)' },
    { id: 'STATUS_UNPAID', name: 'In Progress' },
    { id: 'STATUS_COMPLETE', name: 'Complete' },
    { id: 'STATUS_CANCELLED', name: 'Cancelled' },
]
</script>