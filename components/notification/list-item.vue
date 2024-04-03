<template>
    <v-list-item two-line class="mb-2 py-3" @click="clickAction" :class="{
        'text-disabled': notification.read
    }">
        <template v-slot:prepend>
            <v-icon :icon="icon"></v-icon>
        </template>
        <v-list-item-title>{{ notification.text}}</v-list-item-title>
        <v-list-item-subtitle><em>{{ $filters.normalDate(notification.created_at) }}</em></v-list-item-subtitle>
    </v-list-item>
</template>

<script setup>
const props = defineProps(['notification'])

const { notification, icon, clickAction } = useNotification(props.notification)
</script>