<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <v-form ref="feedbackForm" @submit.prevent="sendFeedback">
        <sourcery-card title="Feedback" icon="mdi-comment-quote">
          <v-card-text class="pb-0 pt-4">
            <p>Complete this form to report a bug or request a feature.</p>
            <v-text-field
              v-model="formData.name"
              label="Your Name"
              :rules="[$sourceryForms.rules.required]"
              outlined
            />
            <v-text-field
              v-model="formData.topic"
              label="Subject"
              :rules="[$sourceryForms.rules.required]"
              outlined
            />
            <v-textarea
              v-model="formData.message"
              name="message"
              label="Message"
              value=""
              :rules="[$sourceryForms.rules.required]"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" type="submit">
              Submit
            </v-btn>
          </v-card-actions>
        </sourcery-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import SourceryCard from '@/components/card-with-header.vue'

export default {
    name: 'Feedback',
    components: {
        SourceryCard
    },
    data () {
        return {
            formData: {
                name: this.$store.state.user ? this.$store.state.user.displayName : '',
                email: this.$store.state.user ? this.$store.state.user.email : '',
                message: null,
                topic: null
            }
        }
    },
    methods: {
        async sendFeedback () {
            // Validate the form
            if (this.$refs.feedbackForm.validate()) {
                // Store the data
                await this.$feedback.send({
                    from: this.formData.email,
                    subject: this.formData.topic,
                    text: this.formData.message
                })

                // Message to user
                alert('Thank you for your feedback!')

                // Reset the form
                this.$refs.feedbackForm.reset()

                // Return to previous page
                this.$router.push('/dashboard')
            }
        }
    }
}
</script>

<style scoped>
</style>
