<template>
    <div id="page-occupation-id" class="py-6">
        <v-container>
            <v-row class="mb-2">
                <v-col cols="12" md="6">
                    <organization-header :organization="organization"></organization-header>
                </v-col>
                <v-col cols="12" md="6">
                    <v-item-group class="d-flex justify-space-between ga-3 fill-height">
                        <v-item>
                            <v-card width="100%" @click="setStatus('Submitted')" link class="fill-height">
                                <!-- <v-card-title class="text-overline">New</v-card-title> -->
                                <v-card-text>
                                    <p class="my-1 fw-bold"><strong>New</strong></p>
                                    <p class="mobile-callout-text mb-0">{{ countSubmitted }}</p>
                                </v-card-text>
                            </v-card>
                            <v-card width="100%" @click="setStatus('In Progress')" link class="fill-height">
                                <!-- <v-card-title class="text-overline">In Progress</v-card-title> -->
                                <v-card-text>
                                    <p class="my-1 fw-bold"><strong>In Progress</strong></p>
                                    <p class="mobile-callout-text mb-0">{{ countInProgress }}</p>
                                </v-card-text>
                            </v-card>
                            <v-card width="100%" @click="setStatus('Complete')" link class="fill-height">
                                <!-- <v-card-title class="text-overline">Complete</v-card-title> -->
                                <v-card-text>
                                    <p class="my-1"><strong>Complete</strong></p>
                                    <p class="mobile-callout-text mb-0">{{ countCompleted }}</p>
                                </v-card-text>
                            </v-card>
                        </v-item>
                    </v-item-group>
                </v-col>
            </v-row>

            <requests-search ref="search" :organization-id="organization.id"></requests-search>
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['organization-member']
})

const route = useRoute()
const { organization, getOrganization } = useOrganizations()
const { organization: countOrganization, countSubmitted, countInProgress, countCompleted, fetchRequestCount } = useRequestCount()

const search = ref(null)

function setStatus(statusName) {
    search.value.setStatus(statusName)
}

await getOrganization(route.params.id)

countOrganization.value = organization.value
await fetchRequestCount()
</script>

<style lang="scss" scoped>
.mobile-callout-text {
    font-size: 1.45rem;
}
</style>