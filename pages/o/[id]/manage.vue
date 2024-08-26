<template>
    <div id="page-occupation-id">
        <v-container>
            <h1 class="mb-10">Organization Settings</h1>

            <v-card title="Request Summary" class="pa-2 mb-15">
                <v-card-text>
                    <v-row class="mb-5">
                        <v-col cols="12" lg="8">
                            <div id="orgPlot" class="mt-5"></div>
                        </v-col>
                        <v-col cols="12" lg="4">
                            <v-card variant="text">
                                <v-table>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Total Requests</th>
                                            <td>{{ organizationStats.totalRequests }}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Total Submitted</th>
                                            <td>{{ organizationStats.totalSubmitted }}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Total Picked-Up</th>
                                            <td>{{ organizationStats.totalPickedUp }}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Total Completed</th>
                                            <td>{{ organizationStats.totalCompleted }}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Total Archived</th>
                                            <td>{{ organizationStats.totalArchived }}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Total Cancelled</th>
                                            <td>{{ organizationStats.totalCancelled }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card title="Manage Appearance" class="pa-2 mb-15">
                <v-card-text>
                    <v-form @submit="updateOrganization">
                        <v-row>
                            <v-col cols="12" sm="6"><v-text-field v-model="organization.name" label="Name"></v-text-field></v-col>
                            <v-col cols="12" sm="6"><v-text-field v-model="organization.address" label="Address"></v-text-field></v-col>
                        </v-row>
                        
                        
                        <v-btn type="submit">Save</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>


            <v-card title="User Summary" class="pa-2 mb-15">
                <v-card-text>
                    <v-table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Total Requests</th>
                                <th>Last Request Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in organizationUserSummary" :key="index">
                                <td>{{ user.email }}</td>
                                <td>{{ user.total_requests }}</td>
                                <td>{{ $filters.normalDate(user.last_request_date) }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-card>

            <v-card title="Attachments Summary" class="pa-2 mb-15">
                <v-card-text>
                    <v-table>
                        <thead>
                            <tr>
                                <th>Preview</th>
                                <th>File Name</th>
                                <th>File Size</th>
                                <th>Uploaded To</th>
                                <th>Uploaded Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(attachment, index) in organizationAttachmentsSummary" :key="index">
                                <td>
                                    <v-avatar size="80" rounded="0" :to="'/request/' + attachment.request_id">
                                        <v-img :src="attachment.thumbnail" height="70"></v-img>
                                    </v-avatar>
                                </td>
                                <td>{{ attachment.label }}</td>
                                <td>{{ $filesize(attachment.size) }}</td>
                                <td><NuxtLink :to="'/request/' + attachment.request_id" >{{ attachment.request_id }}</NuxtLink></td>
                                <td>{{ $filters.normalDate(attachment.created_at) }}</td>
                            </tr>
                            <tr v-if="organizationAttachmentsSummary.length === 0">
                                <td colspan="5" class="text-center">No Attachments Found</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script setup>
import * as Plotly from 'plotly.js-dist'
import { useTheme } from 'vuetify'
const route = useRoute()
const { organization, getOrganization } = useOrganizations()
const supabase = useSupabaseClient()
const theme = useTheme()
const { getAttachmentPreview } = useFileList()

await getOrganization(route.params.id)

const organizationStats = ref({
    totalRequests: 0,
    totalSubmitted: 0,
    totalPickedUp: 0,
    totalCompleted: 0,
    totalArchived: 0,
    totalCancelled: 0,
})

const organizationRequestGraphStats = ref([])
const organizationUserSummary = ref([])
const organizationAttachmentsSummary = ref([])

function plotGraph() {
    const currentDate = new Date()
    const months = []
    const y_axis = []

    // First create a set of usable months, starting with now, go back 12.
    for (let i = 0; i < 12; i++) {
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const date_string = `${year}-${month}`
        months.unshift(date_string)
        currentDate.setMonth(currentDate.getMonth() - 1)

        // Next go through the graph data from server and assign the counts to correct months, or 0 if none.
        let y_value = 0
        for ( let j = 0; j < organizationRequestGraphStats.value.length; j++) {
            let d = new Date(organizationRequestGraphStats.value[j].month)
            let d_string = `${d.getFullYear()}-${d.getMonth() + 1}`
            if (d_string === date_string) {
                y_value = organizationRequestGraphStats.value[j].count
            }
        }
        y_axis.unshift(y_value)
    }
    Plotly.newPlot( document.getElementById('orgPlot'), [{
            x: months,
            y: y_axis,
            'type': 'bar'
        }],
        {   
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { t: 0 },
            autosize: true,
            showlegend: false,
            colorway: ['#654EA3'],
            yaxis: {
                minallowed: 0
            },
            title: {
                text: 'Submitted This Year',
                font: {
                    size: 18,
                    weight: 700
                },
                automargin: true,
                subtitle: {
                    text: 'by Date Created',
                    font: {
                        size: 14,
                        style: 'italic'
                    },
                    automargin: true
                }
            },
            font: {
                color: theme.global.current.value.dark ? 'white' : 'black',
                family: 'Barlow, Roboto, Arial, Helvetica, sans-serif'
            }
        },
        {
            displayModeBar: false
        }
    );
}

function getBaseCountQuery() {
    return supabase
        .from('requests')
        .select('id', { count: 'exact', head: true })
        .in('repository_id', organization.value.repositories.map(repo => repo.id));
}

async function fetchOrganizationStats() {
    const { count: totalRequests, error: totalRequestsError } = await getBaseCountQuery();
    const { count: totalSubmitted, error: totalSubmittedError } = await getBaseCountQuery().eq('status_id', 1);
    const { count: totalPickedUp, error: totalPickedUpError } = await getBaseCountQuery().eq('status_id', 2);
    const { count: totalCompleted, error: totalCompletedError } = await getBaseCountQuery().eq('status_id', 3);
    const { count: totalArchived, error: totalArchivedError } = await getBaseCountQuery().eq('status_id', 4);
    const { count: totalCancelled, error: totalCancelledError } = await getBaseCountQuery().eq('status_id', 5);

    organizationStats.value = {
        totalRequests,
        totalSubmitted,
        totalPickedUp,
        totalCompleted,
        totalArchived,
        totalCancelled,
    }
}


async function fetchGraphStats() {
    const { data, error } = await supabase
        .rpc("graph_organization_requests_by_month", { org_id: organization.value.id });

    organizationRequestGraphStats.value = data;
}


async function fetchUserSummary() {
    const { data, error } = await supabase
        .rpc("organization_user_summary", { org_id: organization.value.id });

    organizationUserSummary.value = data;
}

async function fetchAttachmentsSummary({ page, itemsPerPage, sortBy }) {
    const { data, error } = await supabase
        .from('attachments')
        .select(`id, label, size, created_at, user_id, path, mime, 
        request_id,
        requests!inner (
            id,
            repository_id,
            repositories!inner (
                id,
                organization_id
            )
        ),
        user (
            id,
            email
        )`)
        .gt('size', 0)
        .eq('requests.repositories.organization_id', organization.value.id)
        .order('created_at', { ascending: false });

    const attachment_paths = data.map(attachment => attachment.path)
    if ( attachment_paths.length > 0 ) {
        const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('attachments')
            .createSignedUrls(attachment_paths, 86400) // Signed for one day.
        signedUrlData.forEach((signedUrl, index) => {
            if ( !signedUrl.error ) {
                data[index].url = signedUrl.signedUrl
            }
            data[index].thumbnail = getAttachmentPreview(data[index])
        })
    }

    organizationAttachmentsSummary.value = data;
}

async function updateOrganization() {
    const { data, error } = await supabase
        .from('organizations')
        .update({
            address: organization.value.address,
            name: organization.value.name,
        })
        .eq('id', organization.value.id);
}

watch(theme.global.current, plotGraph)

await fetchOrganizationStats()
await fetchGraphStats()
await fetchUserSummary()
await fetchAttachmentsSummary({})

onMounted(plotGraph)
</script>