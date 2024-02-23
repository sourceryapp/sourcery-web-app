<template>
    <div id="page-request-id">
        <v-container>
            <h1>Request ID Page</h1>
            <p>{{ route.params.id }}</p>
        </v-container>
    </div>
</template>

<script setup>
const route = useRoute()
</script>