<script setup>
const supabase = useSupabaseClient()

const { data: requests, error } = await supabase.from('requests')
    .select('*')
    .is('servicer_id', null)
    .eq('public_can_claim', true)
    .is('repository_id', null)
    .eq('status', 'STATUS_CREATED')
    .eq('deleted', false)
    .order('created_at', { ascending: true })
</script>

<template>
    <div id="page-requests">
        <v-container>
            <h1>Claim Requests</h1>
            <p>Requests here can be claimed by Sourcery users to fulfill.</p>

            <div class="mb-4">
                <npi-card v-for="request in requests" :request="request" :key="request.id"></npi-card>

                <v-alert v-if="requests.length === 0" type="info">No requests available to claim.</v-alert>
            </div>
        </v-container>
    </div>
</template>