<template>
    <div class="bg pa-0">
        <div class="text-xs-center title" id="title" @click="dialog = true" v-ripple="{ class: `white--text` }">
            <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="black"
          dark
          flat
          large
          v-on="on"
          class="hidden-md-and-down"
        >
                Sourcery's response to COVID-19
        <v-icon right>info</v-icon>
        </v-btn>
        <v-btn
          color="black"
          dark
          flat
          v-on="on"
          class="hidden-lg-and-up"
        >
                Sourcery's response to COVID-19
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          primary-title
        >
          Our Response to COVID-19
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text class="text-xs-left body-2" id="message-text">
          In light of the COVID-19 crisis, we are mindful of the fact that our users will be impacted in a myriad of ways. As many archives and libraries will either be closed or will have stricter access policies, that means that requests submitted through the Sourcery platform will go unclaimed and unfulfilled for much longer than usual. During this time, please note:
          <br><br>
          <ol>
            <li>
              Users are not charged for document requests until they are fulfilled. If you have submitted a request that has not been claimed/picked up, you will not be charged. Likewise, if your request has been claimed/picked up, but not fulfilled, you will also not be charged.
            </li>
            <li>
              We strongly advise our users (Sourcerers) NOT to fulfill requests until further notice.
            </li>
            <li>
              You can still submit requests through Sourcery at any time. Please be aware that they are unlikely to be fulfilled while archives are closed and while all of us are doing our best to practice “social distancing.” Requests placed will remain in the queue and will not expire.
            </li>
          </ol>
        </v-card-text>


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            CLOSE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
            <v-icon>arrow-right-circle</v-icon>
        </div>
    </div>


</template>

<script>
import { mapGetters } from 'vuex'
import { functions } from "~/plugins/firebase-client-init.js"

	export default {
        name: "lpBanner",
		data() {
			return {
                snackbar: true,
                dialog: false
			}
        }
	}
</script>

<style scoped>
.bg {
        background-color: #FFC107;
    }
#title {
    font-family: 'Barlow' !important;
    cursor: pointer;
}
#message-text {
  line-height: 18px;
}
</style>
