<template>
    <div id="page-request-id" class="py-5">
        <v-container>
            <h1 class="mb-6">Request Summary</h1>
            <v-row>
                <v-col cols="12" md="8">
                    <v-sheet color="surface-variant" rounded="lg" class="pa-5 fill-height">
                        <v-row>
                            <v-col cols="12" md="3"><h3>Request ID</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.id }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Title</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.request_clients.label }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Citation</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.citation }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Requested By</h3></v-col>
                            <v-col cols="12" md="9">
                                <p class="mb-0">{{ request.user.name }}</p>
                                <p class="mb-0">{{ request.user.email }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Requested To</h3></v-col>
                            <v-col cols="12" md="9">
                                <p class="mb-0"><strong>{{ request.repository.name }} - {{ request.repository.organization.name }}</strong></p>
                                <p class="mb-0">{{ request.repository.address1 }}</p>
                                <p class="mb-0">{{ request.repository.address2 }}</p>
                                <p class="mb-0">{{ request.repository.city }}, {{ request.repository.state }} {{ request.repository.zip }} {{ request.repository.country_code }}</p>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
                <v-col cols="12" md="4">
                    <v-list rounded="lg" class="py-3 pb-4">
                        <v-list-subheader>Request Progress</v-list-subheader>

                        <v-list-item class="py-3 pb-4">
                            <template v-slot:prepend>
                                <v-icon size="large" color="success">mdi-check</v-icon>
                            </template>
                            <v-list-item-title>Submitted</v-list-item-title>
                            <v-list-item-subtitle><em>{{ $filters.normalDate(request.created_at) }}</em></v-list-item-subtitle>
                        </v-list-item>

                        <template v-if="isCancelled">
                            <v-list-item class="py-3 pb-4" active>
                                <template v-slot:prepend>
                                    <v-icon size="large" color="error">mdi-close</v-icon>
                                </template>
                                <v-list-item-title>Cancelled</v-list-item-title>
                                <v-list-item-subtitle><em>{{ $filters.normalDate(cancelledDate) }}</em></v-list-item-subtitle>
                            </v-list-item>
                        </template>

                        <template v-else>
                            <v-list-item class="py-3 pb-4" :active="isSubmitted">
                                <template v-slot:prepend>
                                    <v-icon size="large" color="orange" v-if="isSubmitted">mdi-clock-outline</v-icon>
                                    <v-icon size="large" color="success" v-else>mdi-check</v-icon>
                                </template>
                                <v-list-item-title>
                                    <span v-if="isSubmitted">Waiting for Confirmation</span>
                                    <span v-else>Confirmed</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    <em v-if="isSubmitted">Currently Here</em>
                                    <em v-else>{{ $filters.normalDate(confirmedDate) }}</em>
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item class="py-3 pb-4" :active="isInProgress" :disabled="isSubmitted">
                                <template v-slot:prepend>
                                    <v-icon size="large" color="orange" v-if="isInProgress">mdi-clock-outline</v-icon>
                                    <v-icon size="large"  v-else-if="isSubmitted">mdi-dots-horizontal</v-icon>
                                    <v-icon size="large" color="success" v-else>mdi-check</v-icon>
                                </template>
                                <v-list-item-title>
                                    <span v-if="isInProgress">Being Serviced</span>
                                    <span v-else>Completed</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    <em v-if="isInProgress">Currently Here</em>
                                    <em v-else-if="isCompleted || isArchived">{{ $filters.normalDate(completedDate) }}</em>
                                    <em v-else>Awaiting Confirmation</em>
                                </v-list-item-subtitle>
                            </v-list-item>
                        </template>

                        <template v-if="isArchived">
                            <v-list-item class="py-3 pb-4">
                                <template v-slot:prepend>
                                    <v-icon size="large">mdi-archive</v-icon>
                                </template>
                                <v-list-item-title>Archived</v-list-item-title>
                                <v-list-item-subtitle><em>{{ $filters.normalDate(archivedDate) }}</em></v-list-item-subtitle>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-col>
            </v-row>

            <div class="my-6">
                <pre>{{ request }}</pre>
            </div>
        </v-container>
    </div>
</template>

<script setup>
const { 
    request,
    isSubmitted, isInProgress, isCompleted, isArchived, isCancelled,
    confirmedDate, completedDate, archivedDate, cancelledDate,
    fetchRequest
} = useFetchRequest()

await fetchRequest()
</script>