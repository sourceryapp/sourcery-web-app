<template>
    <div class="user-invite">
        <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps">Invite User</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
                <v-card title="Invite a User">
                    <v-card-text v-if="!confirmedUser">
                        <slot>
                            <p>As an organization owner, you can submit requests on behalf of another user.  If the user does not yet exist, the user will be sent an invitation to join Sourcery upon clicking "Invite User".</p>
                        </slot>
                        <v-text-field label="Invite User Email" v-model="email" :disabled="loading" type="email" placeholder="requester@email.com" variant="outlined"></v-text-field>
                    </v-card-text>
                    <v-card-text v-else>
                        <p>User {{ confirmedUser.email }} has been {{ confirmedUser.created ? 'created' : 'invited' }}.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="isActive.value = false">Close</v-btn>
                        <v-btn color="primary" @click="submitInviteUser" :disabled="loading" variant="text" v-if="!confirmedUser">Invite User</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>

<script setup>
const emit = defineEmits(['inviteUser'])
const { email, loading, confirmedUser, inviteUser } = useInviteUser()

async function submitInviteUser() {
    await inviteUser()
    emit('inviteUser', confirmedUser.value)
}
</script>