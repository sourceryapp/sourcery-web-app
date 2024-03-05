<template>
    <div id="page-dashboard">
        <v-container>
            <template v-if="authUser">
                <h1 class="mb-4">Dashboard</h1>

                <RequestsCreateAlert></RequestsCreateAlert>

                <v-row>
                    <v-col md="8">
                        <v-row>
                            <v-col md="6">
                                <v-text-field label="Search" variant="outlined" v-model="search" @update:model-value="onModelChange" density="compact" prepend-inner-icon="mdi-magnify">
                                    <template v-slot:loader>
                                        <v-progress-linear :active="loading" color="primary" height="7" indeterminate></v-progress-linear>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col md="3">
                                <StatusSelect v-model="selectedStatus" @update:model-value="onModelChange"></StatusSelect>
                            </v-col>
                            <v-col md="3">
                                <v-select v-model="order" :items="orderOptions" variant="outlined" clearable placeholder="Sort Order" label="Sort Order" @update:model-value="onModelChange" density="compact"></v-select>
                            </v-col>
                        </v-row>

                        <RequestListItem v-for="request in requests" :request="request"></RequestListItem>
                    </v-col>
                    <v-col md="4">
                        <v-card @click="setStatus('Complete')" class="mb-4">
                            <v-card-title>Completed</v-card-title>
                            <v-card-text class="py-0">
                                <p>These requests are completed and ready to download assets.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">231,433</p>
                            </v-card-text>
                        </v-card>

                        <v-card @click="setStatus('Submitted')" class="mb-4">
                            <v-card-title>New Requests</v-card-title>
                            <v-card-text class="py-0">
                                <p>These requests were newly submitted, and are waiting to be picked up by an organization.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">231,433</p>
                            </v-card-text>
                        </v-card>

                        <v-card @click="setStatus('In Progress')" class="mb-4">
                            <v-card-title>In Progress</v-card-title>
                            <v-card-text class="py-0">
                                <p>Requests that have been picked up by an organization, and are in progress.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">231,433</p>
                            </v-card-text>
                        </v-card>

                        <v-card to="/requests/unregistered" class="mb-4">
                            <v-card-title>Unregistered</v-card-title>
                            <v-card-text class="py-0">
                                <p>Requests that have been submitted to unregistered institutions.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ requestCount }}</p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>

            <template v-else>
                <h1>Welcome to Sourcery!</h1>
                <p>We recommend that you first <NuxtLink to="/login">Login</NuxtLink> if you have an account, or <NuxtLink to="/register">Register</NuxtLink> to create one before making a request!</p>
            </template>
        </v-container>
    </div>
</template>

<script setup>
const { authUser } = await useAuthUser()
const { findByName, fetchStatus } = useFetchStatus()
const { requestCount, countUriRequests } = useFetchUriRequests()
const { requests, search, selectedStatus, order, loading, orderOptions, fetchRequests, onModelChange } = useRequestSearch()

function setStatus(statusName) {
    selectedStatus.value = [findByName(statusName).id]
    onModelChange()
}

await countUriRequests()
await fetchStatus()
await fetchRequests()
</script>