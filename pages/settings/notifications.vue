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
                :hint="alertHint"
                :persistent-hint="true"
                color="primary"
                class="mt-0"
                @change="updateNotifications"
                :readonly="!deviceHasGeoLocation"
                ></v-switch>
            </v-card-text>
        </v-card>
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
                updateSuccess: false,
                alertHint: 'Please choose "Allow" if prompted by your device/browser.',
                geoError: 'You need to enable location services to use this feature.',
                deviceHasGeoLocation: false, // Starts as read-only until we confirm geolocation
            }
        },
        computed: {

        },
        methods: {

            updateNotifications: async function() {
                this.$store.commit('meta/setAgent', this.agentBool)
                this.$store.dispatch('meta/save', 'agentUpdates');
                this.$toast.show('Notification Preference Saved!')
            }
        },
        mounted() {
            // Check if device supports geolocation
            this.deviceHasGeoLocation = Boolean(navigator.geolocation);
        }
    }
</script>

<style scoped>
</style>
