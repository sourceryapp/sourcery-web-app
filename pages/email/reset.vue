<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm-3>
      <h3>Continue to Sourcery</h3>

      <p>In an effort to prevent bot spam, please use the manual confirmation button below to continue to Sourcery.</p>

      <v-alert
        :value="error !== ''"
        class="my-3"
        type="error"
      >
        {{ error }}
      </v-alert>

      <v-btn v-if="error === ''" color="primary" :href="redirectLink">
        {{ buttonText }}
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
    data () {
        return {
            redirectLink: '',
            type: 'magic',
            error: ''
        }
    },
    computed: {
        typeMatch () {
            const allowed = ['magic', 'recovery']
            if (allowed.includes(this.type)) {
                return this.type
            }
            return null
        },
        buttonText () {
            switch (this.typeMatch) {
            case 'magic':
                return 'Log In'
            case 'recovery':
                return 'Reset Password'
            default:
                return 'Continue'
            }
        }
    },
    mounted () {
        const params = (new URL(location)).searchParams
        this.redirectLink = params.get('confirmation')

        if (!this.redirectLink.includes(process.env.SUPABASE_URL)) {
            this.error = 'Email was created from a different domain than this one.  Please confirm you clicked the correct link.'
        }
        const confirmationLinkParams = (new URL(params.get('confirmation'))).searchParams
        this.type = confirmationLinkParams.get('type')
    }
}
</script>
