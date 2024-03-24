<template>
    <div id="page-request-id" class="py-5">
        <v-container>
            <h1 class="mb-6">Request Summary</h1>
            <v-row class="mb-5">
                <v-col cols="12" md="8">
                    <v-sheet color="surface" elevation="4" rounded class="pa-5 fill-height">
                        <v-row>
                            <v-col cols="12" md="3"><h3>Request ID</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.id }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Title</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ requestLabel }}</p></v-col>
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
                    <requests-progress-panel :request="request"></requests-progress-panel>
                </v-col>
            </v-row>


            <v-expansion-panels model-value="attachments" class="mb-6">
                <v-expansion-panel :title="`Attachments (${request.attachments.length})`" value="attachments">
                    <v-expansion-panel-text class="py-4">
                        <requests-file-manager :request="request" :can-service="canService" v-if="canService || isCompleted || isArchived"></requests-file-manager>
                        <p class="mb-0" v-else-if="isInProgress">The vendor is working on this request - check back later for attachments.</p>
                        <p class="mb-0" v-else>Nothing here yet.</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>


            <v-expansion-panels>
                <v-expansion-panel value="messages">
                    <v-expansion-panel-title class="position-relative">
                        <v-badge color="error" floating dot v-if="hasUnread">Messages</v-badge>
                        <span v-else>Messages</span>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="py-4">
                        <requests-messenger :request="request" v-model="messengerAlertAgree" :can-service="canService"></requests-messenger>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>


            <div class="my-6">
                <pre>{{ request }}</pre>
            </div>
        </v-container>
    </div>
</template>

<script setup>
const { 
    request, requestLabel,
    isInProgress, isCompleted, isArchived,
    canService,
    fetchRequest
} = useFetchRequest()

await fetchRequest()

const { hasUnread, clearUnread } = useRequestMessenger(request.value)

const messengerAlertAgree = ref(true)
</script>