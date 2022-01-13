<template>
  <div class="page-container">
    <div id="content-wrap" class="px-4">
      <sourcery-header class="mx-n4" />
      <v-layout>
        <v-flex xs12 sm6 xl4 offset-sm3 offset-xl4>
          <h1 class="text-center my-24 text-h2 font-weight-medium">
            Join Us
          </h1>
          <p>Fill out the form below if you are interested in joining us as an institution or as a researcher during our testing phase.</p>
          <embed-google-form :link="gformsLink" />
        </v-flex>
      </v-layout>
    </div>
    <sourcery-footer id="footer" />
  </div>
</template>

<script>
import Footer from '~/components/footer'
import Header from '~/components/purple-header.vue'
import EmbedGoogleForm from '~/components/embed-google-form.vue'

export default {
    components: {
        'sourcery-footer': Footer,
        'sourcery-header': Header,
        EmbedGoogleForm
    },
    layout: 'landing-beta',
    data () {
        return {
            gformsLink: 'https://docs.google.com/forms/d/e/1FAIpQLSez2BHbLH_cIJXQlYy05IZ5kXBxmQ7q8nM6CT6sQw-0ujtWZw/viewform?embedded=true'
        }
    }
}
</script>

<style>
.page-container {
  position: relative;
  min-height: 100vh;
}
#content-wrap {
  padding-bottom: 260px;    /* Footer height (160) + extra */
}
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
