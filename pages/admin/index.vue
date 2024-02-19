<template>
    <div id="page-admin">
        <p>This is admin.</p>
        <div>{{ user }}</div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['admin']
});
const user = useSupabaseUser();
</script>