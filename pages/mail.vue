<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <h1>Mail Tester</h1>
      <v-btn @click.prevent="Send()">Send Message</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "~/plugins/firebase-client-init.js";
import Mail from "~/modules/message.js";
export default {
  name: "mail",
  computed: {
    user() {
      return this.$store.getters['auth/activeUser'];
    }
  },
  data: function() {
    return {
      requests: [],
      jobs: []
    };
  },
  methods: {
      Send: () => {
          Mail.send({
              to: 'brian.daley@uconn.edu',
              subject: 'This is a test',
              text: 'Hello there!',
          })
      }
  },
  mounted() {
    // this.$axios
    //     .$get('/requests')
    //     .then(response => (this.requests = response.data));
  }
};
</script>

<style scoped>
</style>
