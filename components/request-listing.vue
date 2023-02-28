<template>
  <v-hover
    v-slot="{ hover }"
    :key="request.id"
  >
    <v-card
      v-if="request"
      :to="cardClickAction"
      class="my-4 rounded-lg"
      outlined
    >
      <v-container>
        <v-row>
          <v-col class="pa-0">
            <v-card-title v-if="!editing">
              {{ label }}
            </v-card-title>
            <v-card-title v-else>
              <v-text-field v-model="editingLabelValue" class="edit-label" label="Edit Label" />
            </v-card-title>
            <v-card-subtitle>
              {{ citation }}
              <br>
              {{ request.repository.name }}
            </v-card-subtitle>
            <v-fade-transition>
              <v-overlay
                v-if="hover"
                absolute
                color="primary"
                opacity="0.1"
                class="rounded-lg"
                z-index="1"
              />
            </v-fade-transition>
          </v-col>
          <v-col v-if="requestActionsList.length > 0" cols="2" align-self="center">
            <v-menu offset-y>
              <template #activator="{ on: { click }, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  :color="actionButtonColor"
                  style="z-index:1"
                  v-bind="attrs"
                  @click.stop.prevent="click"
                >
                  <v-icon dark>
                    mdi-dots-horizontal
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in requestActionsList"
                  :key="index"
                  @click.prevent="item.action"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols="2" align-self="center">
            <v-menu offset-y>
              <template #activator="{ on: { click }, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  :color="actionButtonColor"
                  style="z-index:1"
                  v-bind="attrs"
                  @click.stop.prevent="click"
                >
                  <v-icon dark>
                    mdi-message-processing
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in requestActionsList"
                  :key="index"
                  @click.prevent="item.action"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col
            cols="auto"
            :class="labelClass"
            z-index="2"
          >
            <p
              class="font-weight-bold text-button ma-0"
              :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
            >
              {{ request.status.name }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-hover>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Request } from '~/models/Request'

export default {
    props: {
        request: {
            type: Object,
            required: true
        },
        client: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            editing: false,
            editingLabelValue: ''
        }
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            userRepositories: 'supabaseAuth/userRepositories'
        }),
        isClient () {
            return this.request.user_id === this.authUser.id
        },
        label () {
            if (!this.client) {
                return this.request.request_vendor.label
            }
            return this.request.request_client.label
        },
        labelClass () {
            let classes = 'd-flex align-center justify-center rounded-r-lg px-4'
            const status_name = this.request?.status?.name
            if (status_name === 'Submitted') {
                classes += ' bg-teal'
            } else if (status_name === 'In Progress') {
                classes += ' bg-blue'
            } else if (status_name === 'Complete' || status_name === 'Archived' || status_name === 'Cancelled') {
                classes += ' bg-purple'
            }

            return classes
        },
        showLabelEdit () {
            const statuses = ['Submitted', 'In Progress']
            return statuses.includes(this.request.status.name)
        },
        showChatInit () {
            const statuses = ['In Progress', 'Complete']
            return statuses.includes(this.request.status.name)
        },
        showPickUp () {
            return Request.isSubmitted(this.request) && Request.canManage(this.userRepositories, this.request)
        },
        actionButtonColor () {
            return this.$vuetify.theme.dark ? '#707070' : '#C3C3C3'
        },
        cardClickAction () {
            if (this.editing) {
                return undefined
            }
            return '/request/' + this.request.id
        },
        requestActionsList () {
            const list = []
            if (this.showLabelEdit) {
                if (this.editing) {
                    list.push({
                        name: 'Save Label',
                        action: this.saveLabel
                    })
                }
                list.push({
                    name: this.editing ? 'Cancel Editing' : 'Edit Label',
                    action: this.editLabel
                })
            }
            if (this.showChatInit) {
                list.push({
                    name: 'Open Chat',
                    action: this.openChat
                })
            }

            if (this.showPickUp) {
                list.push({
                    name: 'Move to In Progress',
                    action: this.pickUp
                })
            }

            return list
        },
        citation () {
            return (this.request.citation.length > 100) ? this.request.citation.substr(0, 99) + '&hellip;' : this.request.citation
        }
    },
    created () {
        this.editingLabelValue = this.label
    },

    methods: {
        ...mapActions({
            startChat: 'supabaseChat/openForRequest'
        }),
        editLabel () {
            this.editing = !this.editing
            console.log('edit label')
        },
        openChat () {
            this.startChat(this.request)
        },
        async saveLabel () {
            this.editing = false
            if (this.request instanceof Request) {
                const result = await this.request.saveLabel(this.client, this.editingLabelValue)
                if (result) {
                    this.$toast.success('Label saved successfully.')
                    return
                }
            }
            this.$toast.error('Issue saving label.')
        },
        async pickUp () {
            if (this.request instanceof Request) {
                const result = await this.request.pickUp()
                if (result) {
                    this.$toast.success('Picked up request.')
                    this.$emit('requestUpdated')
                    return
                }
            }
            this.$toast.error('Issue picking up request.')
        }
    }
}
</script>

<style>
.bg-teal {
  background-color: #69ced5;
}

.bg-blue {
  background-color: #3686d4;
}

.bg-purple {
  background-color: #6b49a9;
}

.edit-label {
  z-index: 999;
}
</style>
