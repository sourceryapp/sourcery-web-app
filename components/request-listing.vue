<template>
  <v-hover
    v-slot="{ hover }"
    :key="request.id"
  >
    <v-card
      v-if="request"
      :to="'/request/' + request.id"
      class="my-4 rounded-lg"
      outlined
    >
      <v-container>
        <v-row>
          <v-col class="pa-0">
            <v-card-title>
              {{ label }}
            </v-card-title>
            <v-card-subtitle>
              {{ request.citation }}
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
    computed: {
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
            } else if (status_name === 'Picked Up') {
                classes += ' bg-blue'
            } else if (status_name === 'Complete' || status_name === 'Archived') {
                classes += ' bg-purple'
            }

            return classes
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
</style>
