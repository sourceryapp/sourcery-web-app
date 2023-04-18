<template>
  <div class="user-lookup-modal">
    <v-dialog v-model="open" :width="width">
      <v-card>
        <v-card-title>Select a Patron</v-card-title>
        <v-card-text>
          <p>As an organization owner, you can submit requests on behalf of another user.  If the user does not yet exist, an account will be created for them and they will be sent a confirmation email upon clicking "Verify User".</p>
          <v-text-field
            v-model="email"
            type="email"
            placeholder="requester@email.com"
            label="Client Email"
            outlined
            :disabled="inputDisabled"
          />

          <p v-if="confirmedText">
            <v-icon :class="confirmedIcon">
              {{ confirmedIcon }}
            </v-icon>
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
    <v-btn color="primary" class="mb-4" @click="openDialog">
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
            } else if (this.confirming) {
                return 'Confirming...'
            }
            return false
        },
        confirmedIcon () {
            if (this.confirming) {
                return 'mdi-refresh'
            }
            return 'mdi-check'
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
            this.reset()
            this.open = false
        },
        reset () {
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
            this.reset()
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

.mdi-refresh {
    animation:spin 2s linear infinite;
}
@keyframes spin {
    100% {
        -webkit-transform: rotate(360deg);
        transform:rotate(360deg);
    }
}
</style>
