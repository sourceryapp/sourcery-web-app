<template>
    <div class="request-list">
        <v-list lines="three">
            <v-list-item v-for="request in requests">
                <template v-slot:subtitle>
                    <div><span>{{ request.status.name }}</span> - {{ request.citation }}</div>
                </template>
                <template v-slot:title>
                    <div>{{ request.request_clients.label }}</div>
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup>
const requests = await useFetchRequests()
</script>