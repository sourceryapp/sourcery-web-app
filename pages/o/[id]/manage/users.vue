<script setup>
definePageMeta({
    middleware: ['organization-owner']
})
const route = useRoute()
const { organization, organizationUsers, email, getOrganization, getOrganizationUsers, inviteUser,removeUser } = useOrganizations()
await getOrganization(route.params.id)
await getOrganizationUsers(route.params.id)
const errorMessage = ref('')
const loading = ref(false)

async function addUser() {
    errorMessage.value = ''
    loading.value = true
    try {
        await inviteUser(route.params.id)
        email.value = ''
        await getOrganizationUsers(route.params.id)
    } catch (err) {
        errorMessage.value = 'There was an error adding the user.  The user must already have an account and not already exist as a member.'
    }
    loading.value = false
}

async function deleteUser(userId) {
    errorMessage.value = ''
    loading.value = true
    try {
        await removeUser(route.params.id, userId)
        await getOrganizationUsers(route.params.id)
    } catch (err) {
        errorMessage.value = 'There was an error removing the user.'
    }
    loading.value = false
}
</script>

<template>
    <div id="page-organization-manage-users">
        <v-container>
            <div class="mb-4">
                <organization-header :organization="organization"></organization-header>
            </div>

            <div class="mb-4">
                <v-card variant="outlined">
                    <v-card-text>
                        <h2 class="mb-0">Manage Users</h2>
                        <p class="text-muted mb-2">Invite a user to join your organization.</p>
                        <v-form :disabled="loading" @submit.prevent="addUser">
                            <v-text-field label="Email" v-model="email"></v-text-field>
                            <v-btn color="primary" type="submit">Add User</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </div>

            <div v-if="errorMessage" class="mb-4">
                <v-alert type="error">{{ errorMessage }}</v-alert>
            </div>

            <div class="mb-4">
                <v-table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-secondary">
                            <td>{{ organization.owner.email }}</td>
                            <td>Owner</td>
                            <td>
                                <v-chip color="success">Confimed</v-chip>
                            </td>
                            <td></td>
                        </tr>
                        <tr v-for="userpivot in organizationUsers" :key="userpivot.user.id">
                            <td>{{ userpivot.user.email }}</td>
                            <td>Member</td>
                            <td>
                                <v-chip color="success" v-if="userpivot.confirmed">Confirmed</v-chip>
                                <v-chip color="warning" v-else>Invited</v-chip>
                            </td>
                            <td>
                                <v-menu transition="slide-y-transition">
                                    <template v-slot:activator="{ props }">
                                        <v-btn size="small" color="secondary" v-bind="props">Actions <v-icon>mdi-chevron-down</v-icon></v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item color="error" title="Remove" @click="deleteUser(userpivot.user_id)"></v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </v-container>
    </div>
</template>