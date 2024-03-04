<template>
    <div id="page-dashboard">
        <v-container v-if="authUser">
            <h1>Personal Dashboard</h1>

            <RequestsUriAlert></RequestsUriAlert>

            <v-row>
                <v-col>
                    <RequestList />
                </v-col>
                <v-col>
                    <RequestList />
                </v-col>
            </v-row>
        </v-container>

        <v-container v-else>
            <h1>Welcome to Sourcery!</h1>
            <p>We recommend that you first <NuxtLink to="/login">Login</NuxtLink> if you have an account, or <NuxtLink to="/register">Register</NuxtLink> to create one before making a request!</p>
        </v-container>
    </div>
</template>

<script setup>
const { authUser } = await useAuthUser()
</script>