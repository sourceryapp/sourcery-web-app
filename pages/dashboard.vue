<template>
    <div id="page-dashboard" class="py-4">
        <v-container>
            <template v-if="authUser">
                <h1 class="mb-4">Dashboard</h1>

                <RequestsCreateAlert></RequestsCreateAlert>

                <v-row>
                    <v-col md="8">
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field label="Search" variant="outlined" v-model="search" @update:model-value="onModelChange" density="compact" prepend-inner-icon="mdi-magnify" hide-details>
                                    <template v-slot:loader>
                                        <v-progress-linear :active="loading" color="primary" height="7" indeterminate></v-progress-linear>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col md="4">
                                <StatusSelect v-model="selectedStatus" @update:model-value="onModelChange"></StatusSelect>
                            </v-col>
                            <v-col md="4">
                                <v-select v-model="order" :items="orderOptions" variant="outlined" clearable placeholder="Sort Order" label="Sort Order" @update:model-value="onModelChange" density="compact"></v-select>
                            </v-col>
                        </v-row>

                        <v-sheet v-for="request in requests" elevation="1" class="bg-surface-variant mb-6 py-4 px-6">
                            <v-row justify="start" align="center" class="mb-4">
                                <v-col cols="12" md="auto">
                                    <StatusChip :status="request.status"></StatusChip>
                                </v-col>
                                <v-col cols="12" md="auto">
                                    <span class="text-body-2 d-block">{{ request.repository.name }} - {{ request.repository.organization.name }}</span>
                                    <span class="text-body-2 d-block text-muted"><em>Created: {{ $filters.normalDate(request.created_at) }}, Last Updated: {{ $filters.normalDate(request.updated_at) }}</em></span>
                                </v-col>
                            </v-row>
                            <h3>{{ request.request_client.label }}</h3>
                            <p>{{ request.citation }}</p>
                            <v-divider class="mb-4"></v-divider>
                            <div class="d-flex align-center justify-start">
                                <v-btn color="primary" variant="text" border="0" :to="`/request/${request.id}`" class="mb-2 me-2">View Request</v-btn>
                                <v-btn color="primary" variant="text" border="0" class="mb-2">Open Discussion</v-btn>
                            </div>
                        </v-sheet>

                        <div v-if="requests.length === 0">
                            <div v-if="hasQuery">
                                <p>No requests found for your search.</p>
                            </div>
                            <div v-else>
                                <p>No requests here.</p>
                            </div>
                        </div>
                    </v-col>
                    <v-col md="4" class="d-none d-md-block">
                        <v-card @click="setStatus('Complete')" class="mb-4">
                            <v-card-title>Completed</v-card-title>
                            <v-card-text class="py-0">
                                <p>These requests are completed and ready to download assets.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ countCompleted }}</p>
                            </v-card-text>
                        </v-card>

                        <v-card @click="setStatus('Submitted')" class="mb-4">
                            <v-card-title>New Requests</v-card-title>
                            <v-card-text class="py-0">
                                <p>These requests were newly submitted, and are waiting to be picked up by an organization.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ countSubmitted }}</p>
                            </v-card-text>
                        </v-card>

                        <v-card @click="setStatus('In Progress')" class="mb-4">
                            <v-card-title>In Progress</v-card-title>
                            <v-card-text class="py-0">
                                <p>Requests that have been picked up by an organization, and are in progress.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ countInProgress }}</p>
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
const { requests, search, selectedStatus, order, loading, orderOptions, hasQuery, fetchRequests, onModelChange } = useRequestSearch()
const { countSubmitted, countInProgress, countCompleted, fetchRequestCount } = useRequestCount()

function setStatus(statusName) {
    selectedStatus.value = [findByName(statusName).id]
    onModelChange()
}

await countUriRequests()
await fetchStatus()
await fetchRequests()
await fetchRequestCount()
</script>