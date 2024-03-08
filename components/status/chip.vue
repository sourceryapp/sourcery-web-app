<template>
    <v-chip :color="color" variant="tonal">{{ status.name }}</v-chip>
</template>

<script setup>
const props = defineProps(['status'])

const color = computed(() => {
    switch (props.status.name) {
        case 'Submitted':
            return 'blue-lighten-1'
        case 'In Progress':
            return 'orange'
        case 'Complete':
            return 'green'
        default:
            return 'grey'
    }
})
</script>