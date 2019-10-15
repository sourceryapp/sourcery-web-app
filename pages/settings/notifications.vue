<template>
    <v-app id="tube">
        <v-container fluid>
        <h1>Notifications</h1>

        <v-card width="350px">
            <v-card-title primary-title>
                <h3 class="headline mb-0">Job Alerts (agents only)</h3>
            </v-card-title>
            <v-card-text>
                <v-switch
                label="Receive alerts for nearby jobs."
                v-model="agentBool"
                color="primary"
                class="mt-0"
                ></v-switch>
            </v-card-text>
        </v-card>

        <v-btn @click="updateNotifications" color="primary">Save</v-btn>
        <v-alert
            :value = updateSuccess
             type="success">
            <span color="white">Notification settings updated.</span>
        </v-alert>
        </v-container>
    </v-app>
</template>

<script>
    import { Auth, db } from '~/plugins/firebase-client-init.js'
    import firebase from 'firebase/app'

    export default {
        data () {
            return {
                agentBool: this.$store.state.meta.agentUpdates,
                updateSuccess: false
            }
        },
        computed: {

        },
        methods: {
            updateNotifications: async function() {
                await db.collection('user-meta').doc(this.$store.getters['auth/activeUser'].uid).set({
                    agentUpdates: this.agentBool
                }, { merge: true });
                this.$store.commit('meta/setAgent', this.phone)
                this.updateSuccess = true;
            }
        }
    }
</script>

<style scoped>
</style>
