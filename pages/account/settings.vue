<template>
    <div id="page-profile-settings">
        <v-container class="py-6">
            <h1>Settings</h1>

            <v-list class="bg-transparent">
                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon>mdi-brightness-7</v-icon>
                    </template>
                    <v-list-item-title>Theme</v-list-item-title>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ToggleTheme />
                        </v-list-item-action>
                    </template>
                </v-list-item>
            </v-list>

            <v-list class="bg-transparent">
                <v-list-item lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-account</v-icon>
                    </template>
                    <v-list-item-title>Name</v-list-item-title>
                    <v-list-item-subtitle>{{ authUser?.name }}</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ProfileChangeName />
                        </v-list-item-action>
                    </template>
                </v-list-item>

                <v-list-item lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-email</v-icon>
                    </template>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ authUser?.email }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-phone</v-icon>
                    </template>
                    <v-list-item-title>Phone</v-list-item-title>
                    <v-list-item-subtitle>{{ authUser?.phone ?? 'No data.' }}</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ProfileChangePhone />
                        </v-list-item-action>
                    </template>
                </v-list-item>

                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon>mdi-lock</v-icon>
                    </template>
                    <v-list-item-title>Password</v-list-item-title>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ProfileChangePassword />
                        </v-list-item-action>
                    </template>
                </v-list-item>
            </v-list>


            <h2 class="mt-5 mb-2">Billing Address</h2>
            <p>Add a billing address to become eligible for paid services.</p>
            <user-billing-address />
            

            <h2 class="mt-5 mb-2">Claim Eligibility</h2>
            <p>See if you have passed the requirements in order to claim public requests.</p>

            <v-list density="compact">
                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon :icon="user.email_confirmed_at ? 'mdi-check' : 'mdi-close'"
                            :color="user.email_confirmed_at ? 'success' : 'error'"></v-icon>
                    </template>
                    <v-list-item-title>{{ user.email_confirmed_at ? 'Email has been confirmed.' : 'Must confirm your email.' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon :icon="authUser.phone ? 'mdi-check' : 'mdi-close'"
                            :color="authUser.phone ? 'success' : 'error'"></v-icon>
                    </template>
                    <v-list-item-title>{{ authUser.phone ? 'Phone number has been supplied.' : 'Must provide a phone number.' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon :icon="authUser.name ? 'mdi-check' : 'mdi-close'"
                            :color="authUser.name ? 'success' : 'error'"></v-icon>
                    </template>
                    <v-list-item-title>{{ authUser.name ? 'Name has been supplied.' : 'Must provide a name.' }}</v-list-item-title>
                </v-list-item>
            </v-list>


            <h2 class="mt-5 mb-2" id="organizations">Organizations &amp; Invitations</h2>
            <p>Manage your organizations and invitations.</p>


            <v-list class="bg-transparent mb-10">

                <v-list-item v-for="invite in userOrgInvites" :key="invite.organizations.id" lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-email-alert</v-icon>
                    </template>
                    <v-list-item-title>{{ invite.organizations.name }}</v-list-item-title>
                    <v-list-item-subtitle>Invitation</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <v-btn color="success" variant="outlined" size="small" class="me-2" @click="acceptInvite(invite.organizations.id)">Accept</v-btn>
                            <v-btn color="error" variant="outlined" size="small" @click="declineInvite(invite.organizations.id)">Deny</v-btn>
                        </v-list-item-action>
                    </template>
                </v-list-item>

                <v-list-item v-for="organization in userOrgs" :key="organization.id" lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-domain</v-icon>
                    </template>
                    <v-list-item-title>{{ organization.name }}</v-list-item-title>
                    <v-list-item-subtitle>Owner</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <NuxtLink :to="`/o/${organization.id}`">Manage</NuxtLink>
                        </v-list-item-action>
                    </template>
                </v-list-item>

                <v-list-item v-for="membership in userOrgMember" :key="membership.organizations.id" lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-domain</v-icon>
                    </template>
                    <v-list-item-title>{{ membership.organizations.name }}</v-list-item-title>
                    <v-list-item-subtitle>Member</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <NuxtLink :to="`/o/${membership.organizations.id}`">Manage</NuxtLink>
                        </v-list-item-action>
                    </template>
                </v-list-item>

                <v-list-item v-if="userOrgInvites.length === 0 && userOrgs.length === 0 && userOrgMember.length === 0" lines="two">
                    <v-list-item-title>You are not part of any organizations.</v-list-item-title>
                    <v-list-item-subtitle>You do not have any organization invites.</v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </v-container>
    </div>
</template>

<script setup>
const { authUser, userOrgs, userOrgInvites, userOrgMember, acceptInvite, declineInvite } = useAuthUser()
const user = useSupabaseUser()
</script>