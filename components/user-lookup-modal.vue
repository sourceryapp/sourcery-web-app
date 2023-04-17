<template>
  <div class="user-lookup-modal">
    <v-dialog v-model="open" :width="width">
      <v-card>
        <v-card-title>Select a Patron</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            type="email"
            placeholder="requester@email.com"
            label="Client Email"
            outlined
            :disabled="inputDisabled"
          />

          <p v-if="confirmedText">
            <v-icon>mdi-check</v-icon>
            {{ confirmedText }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn type="primary" @click.prevent="confirmButtonAction">
            {{ confirmButtonText }}
          </v-btn>
          <v-btn type="danger" @click.prevent="cancel">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn @click="openDialog">
      Creating on behalf of a patron?
    </v-btn>
  </div>
</template>

<script>
import { User } from '~/models/User.ts'

export default {
    props: {
        seedEmail: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 600
        }
    },
    data () {
        return {
            open: false,
            email: '',
            confirming: false,
            created: false,
            confirmed: false,
            retrievedUser: null
        }
    },
    computed: {
        inputDisabled () {
            return this.confirming
        },
        confirmedText () {
            if (this.confirmed && this.retrievedUser) {
                return `Confirmed creating on behalf of ${this.retrievedUser.email}`
            }
            return false
        },
        confirmedAndHasValidUser () {
            return this.confirmed && this.retrievedUser && this.retrievedUser.id && !this.confirming
        },
        confirmButtonText () {
            if (this.confirmedAndHasValidUser) {
                return 'Continue'
            }
            return 'Verify User'
        }
    },
    mounted () {
        if (this.seedEmail) {
            console.log('seeding')
            this.email = this.seedEmail
        }
    },
    methods: {
        cancel () {
            this.close()
            this.email = ''
            this.confirming = false
            this.created = false
            this.confirmed = false
            this.retrievedUser = null
        },
        confirmButtonAction () {
            if (!this.confirmedAndHasValidUser) {
                return this.confirmUser()
            } else {
                return this.continue()
            }
        },
        async confirmUser () {
            this.confirmed = false
            this.confirming = true
            console.log('confirming user ' + this.email)
            const u = await User.getOrSignUp(this.email)
            if (u && u.id) {
                this.retrievedUser = {
                    id: u.id,
                    email: u.email
                }

                this.created = u.created
                this.confirmed = true
            }
            this.confirming = false
        },
        continue () {
            console.log('continue')
            this.$emit('user-selected', Object.assign({}, {
                email: this.retrievedUser.email,
                id: this.retrievedUser.id
            }))
            this.open = false
        },
        openDialog () {
            this.open = true
        }
    }
}
</script>

<style lang="scss">
.user-lookup-modal-content {
    background: black;
}
</style>
