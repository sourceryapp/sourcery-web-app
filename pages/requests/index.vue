<script setup>
const supabase = useSupabaseClient()

const { data: requests, error } = await supabase.from('requests')
    .select(`
        *,
        status!inner (*)
    `)
    .is('servicer_id', null)
    .eq('public_can_claim', true)
    .eq('status.name', 'Submitted')
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
            </div>
        </v-container>
    </div>
</template>