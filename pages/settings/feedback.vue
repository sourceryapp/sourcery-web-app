<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        Feedback
      </h1>
      <v-form ref="feedbackForm" @submit.prevent="sendFeedback">
        <v-card outlined>
          <v-card-title
            :class="$vuetify.theme.dark ? 'flex-nowrap justify-space-between primary--text text--lighten-2 secondary' : 'flex-nowrap justify-space-between primary--text text--darken-2 deep-purple lighten-5'"
          >
            Feedback
            <v-icon
              :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
            >
              mdi-comment-quote
            </v-icon>
          </v-card-title>
          <v-divider />
          <v-card-text class="pb-0">
            <p>Complete this form to report a bug or request a feature.</p>
            <v-text-field
              v-model="formData.name"
              label="Your Name"
              :rules="[rules.required]"
              outlined
            />
            <v-text-field
              v-model="formData.topic"
              label="Subject"
              :rules="[rules.required]"
              outlined
            />
            <v-textarea
              v-model="formData.message"
              name="message"
              label="Message"
              value=""
              :rules="[rules.required]"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" type="submit">
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {

    data () {
        return {
            formData: {
                name: this.$store.state.user ? this.$store.state.user.displayName : '',
                email: this.$store.state.user ? this.$store.state.user.email : '',
                message: null,
                topic: null
            },
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length <= 20 || 'Max 20 characters',
                email: (value) => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }
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
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style scoped>
</style>
