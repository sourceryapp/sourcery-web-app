<template>
    <div id="page-occupation-id">
        <v-container>
            <h1>Organization Settings</h1>
            <div>{{ organization }}</div>
            <p>Requests Bar Graph</p>
            <p>Time for Request Completion Average?</p>

            <v-row class="mb-5">
                <v-col cols="12" md="7">
                    <v-sparkline
                        type="bar"
                        :value="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                        :fill="true"
                        :gradient="['red']"
                        :auto-line-width="true"
                        :height="100"
                        :line-width="2"
                        auto-draw
                    ></v-sparkline>
                </v-col>
                <v-col cols="12" md="5">
                    <v-card title="Request Summary">
                        <v-table>
                            <tbody>
                                <tr>
                                    <th scope="row">Total Requests</th>
                                    <td>###</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total Submitted</th>
                                    <td>###</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total Picked-Up</th>
                                    <td>###</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total Completed</th>
                                    <td>###</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total Archived</th>
                                    <td>###</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total Cancelled</th>
                                    <td>###</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>

            <v-card title="Manage Appearance" class="pa-2">
                <v-card-text>
                    <v-form @submit="saveAddress">
                        <v-row>
                            <v-col cols="12" sm="6"><v-text-field v-model="organization.name" label="Name"></v-text-field></v-col>
                            <v-col cols="12" sm="6"><v-text-field v-model="organization.address" label="Address"></v-text-field></v-col>
                        </v-row>
                        
                        
                        <v-btn type="submit">Save</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script setup>
const route = useRoute()
const { organization, getOrganization } = useOrganizations()

await getOrganization(route.params.id)

function saveAddress() {
    console.log('saving')
}
</script>