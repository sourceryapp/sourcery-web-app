<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <sourcery-card title="Feedback" icon="mdi-comment-quote-outline" class="mt-12">
        <p class="p-4 mt-4">
          Please email <a :href="carlyEmailLink">{{ carlyEmail }}</a> or <a :href="brianEmailLink">{{ brianEmail }}</a> for feedback regarding Sourcery!
        </p>
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import SourceryCard from '~/components/card-with-header.vue'

export default {
    components: {
        SourceryCard
    },
    data () {
        return {
            subject: 'Sourcery Feedback',
            carlyEmail: 'carly@uconn.edu',
            brianEmail: 'brian.kelleher@uconn.edu'
        }
    },
    computed: {
        carlyEmailLink () {
            return `mailto:${this.carlyEmail}?subject=${this.subject}`
        },
        brianEmailLink () {
            return `mailto:${this.brianEmail}?subject=${this.subject}`
        }
    }
}
</script>
