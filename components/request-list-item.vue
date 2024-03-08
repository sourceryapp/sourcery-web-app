<template>
    <v-list-item>
        <template v-slot:subtitle>
            <div><span>{{ props.request.status.name }}</span> - {{ props.request.citation }}</div>
        </template>
        <template v-slot:title>
            <div>{{ props.request.request_client.label }}</div>
        </template>
        <template v-slot:append>
            <v-btn icon="mdi-dots-horizontal" border="none"></v-btn>
        </template>
    </v-list-item>
</template>

<script setup>
const props = defineProps(['request'])
</script>