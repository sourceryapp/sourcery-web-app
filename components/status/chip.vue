<template>
    <v-chip :color="color" variant="tonal">{{ statusName }}</v-chip>
</template>

<script setup>
const props = defineProps(['status'])

const color = computed(() => {
    switch (props.status) {
        case 'STATUS_CREATED':
            return 'blue-lighten-1'
        case 'STATUS_UNPAID':
            return 'orange'
        case 'STATUS_PAID':
            return 'orange'
        case 'STATUS_COMPLETE':
            return 'success'
        case 'STATUS_CANCELLED':
            return 'error'
        default:
            return 'grey'
    }
})

const statusName = computed(() => {
    switch (props.status) {
        case 'STATUS_CREATED':
            return 'Created'
        case 'STATUS_PAID':
            return 'In Progress'
        case 'STATUS_UNPAID':
            return 'In Progress'
        case 'STATUS_COMPLETE':
            return 'Complete'
        case 'STATUS_CANCELLED':
            return 'Cancelled'
        case 'STATUS_ARCHIVED':
            return 'Archived'
        default:
            return 'Unknown'
    }
})
</script>