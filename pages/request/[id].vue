<template>
    <div id="page-request-id" class="py-5">
        <v-container>
            <h1>Request Summary</h1>
            <v-row>
                <v-col cols="12" md="8">
                    This houses the request details.
                </v-col>
                <v-col cols="12" md="4">
                    A menu of the status and next steps.
                </v-col>
            </v-row>

            {{ request }}
        </v-container>
    </div>
</template>

<script setup>
const { request, fetchRequest } = useFetchRequest()

await fetchRequest()
</script>