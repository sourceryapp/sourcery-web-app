<template>
    <div id="page-messages" class="py-10">
        <v-container>
            <h1 class="mb-3">New Notifications</h1>
            <v-list class="mb-10">
                <notification-list-item v-for="notif in unreadNotifications" :notification="notif"></notification-list-item>
                <v-list-item v-if="!unreadNotifications.length" title="No New Notifications" subtitle="All messages have been read."></v-list-item>
            </v-list>

            <h1 class="mb-3">Read Notifications</h1>
            <v-list>
                <notification-list-item v-for="notif in readNotifications" :notification="notif"></notification-list-item>
                <v-list-item v-if="!readNotifications.length" title="No Existing Notifications" subtitle="Nothing to see here yet."></v-list-item>
            </v-list>
        </v-container>
    </div>
</template>

<script setup>
const { unreadNotifications, readNotifications, loading, fetchNotifications } = useFetchNotifications()

await fetchNotifications()
</script>