<template>
    <v-app id="tube">
        <v-container fluid>
        <h1>Notifications</h1>
        
        <v-card width="350px">
        <span> &emsp; News </span>
        <v-switch
        label="Recieve Tube news and promotional offers."
        color="info"
        v-model="switch1"
        ></v-switch>
        </v-card>

        <v-card width="350px">
        <span> &emsp; Requests </span>
        <v-switch
        label="Recieve updates on the status of your request."
        color="info" 
        v-model="switch2"
        ></v-switch>
        </v-card>
        
        <v-card width="350px" height="100px">
        <span> &emsp; Job Alerts (agents only) </span>
        <v-switch
        label="Recieve updates on nearby jobs.  "
        color="info"
        v-model="switch3"
        ></v-switch>
        </v-card>

        <v-btn to="/account/settings"><span>Back</span></v-btn>
        </v-container>
    </v-app>
</template>

<script>
    export default {
        data () {
            return {
                switch1: true,
                switch2: true,
                switch3: true
            }
        }
    }
</script>

<style scoped>
</style>