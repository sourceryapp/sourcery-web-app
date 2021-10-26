<template>
  <v-app id="tube">
    <v-container fluid>
      <h1>Notifications</h1>

      <v-card width="350px">
        <v-card-title primary-title>
          <h3 class="text-h5 mb-0">
            Job Alerts (Sourcerers only)
          </h3>
        </v-card-title>
        <v-card-text>
          <v-switch
            v-model="agentBool"
            label="Receive alerts for nearby jobs (email)."
            :hint="alertHint"
            :persistent-hint="false"
            color="primary"
            class="mt-0"
            :readonly="!deviceHasGeoLocation"
            @change="updateNotifications"
          />

          <!--<v-switch
                label="Receive alerts for nearby jobs (push notifications)."
                v-model="pushBool"
                :hint="alertHint"
                :persistent-hint="false"
                color="primary"
                @change="getMessagingToken()"
                :readonly="!deviceHasGeoLocation"
                ></v-switch>-->
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>

export default {
    data () {
        return {
            agentBool: this.$store.state.meta.agentUpdates,
            pushBool: this.$store.state.meta.agentPush,
            // token: this.$store.state.meta.token,
            updateSuccess: false,
            alertHint: 'Please choose "Allow" if prompted by your device/browser.',
            geoError: 'You need to enable location services to use this feature.',
            deviceHasGeoLocation: false // Starts as read-only until we confirm geolocation
        }
    },
    computed: {

    },
    mounted () {
    // Check if device supports geolocation
        this.deviceHasGeoLocation = Boolean(navigator.geolocation)
    },
    methods: {

        async updateNotifications () {
            this.$store.commit('meta/setAgent', this.agentBool)
            await this.$store.dispatch('meta/save', 'agentUpdates')
            this.$toast.show('Notification Preference Saved!')
        },

        getMessagingToken () {
            /** messaging.getToken().then((token) => {
                        console.log("Token: ", token);
                        //this.token = token;
                        this.changeSubscription(token)
                        this.$store.commit('meta/setToken', token)
                        this.$store.dispatch('meta/save', 'token');
                        this.$toast.show('Token Saved!')
                })**/
        },

        async changeSubscription (token) {
            this.$store.commit('meta/setPush', this.pushBool)
            await this.$store.dispatch('meta/save', 'agentPush')
            this.$toast.show('Notification Preference Saved!')

            /* if (this.pushBool == false || this.pushBool == null) {
                    //Unsubscribe Here
                    console.log("Unsubscribing.")
                    let topic = 'general';
                    let subFunct = functions.httpsCallable('unsubscribeFromTopic');
                    let data = await subFunct({token: token, topic: topic});
                    console.log(data)
                    return data;
                }
                else {
                    //Subscribe Here
                    console.log("Subscribing!")
                    let topic = 'general';
                    let subFunct = functions.httpsCallable('subscribeToTopic');
                    let data = await subFunct({token: token, topic: topic});
                    console.log(data)
                    return data;
                }
                */
        }
    }
}
</script>

<style scoped>
</style>
