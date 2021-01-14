<template>
  <v-app id="tube">
    <v-form ref="feedbackForm" @submit.prevent="sendFeedback">
      <v-card>
        <v-card-title class="headline">
          Feedback
        </v-card-title>
        <v-card-text>
          <p>Complete this form to report a bug or request a feature.</p>
          <v-text-field
            v-model="formData.name"
            label="Your Name"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="formData.topic"
            label="Subject"
            :rules="[rules.required]"
          />
          <v-textarea
            v-model="formData.message"
            name="message"
            label="Message"
            value=""
            :rules="[rules.required]"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" dark to="/dashboard">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn color="teal darken-1" dark type="submit">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-app>
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
