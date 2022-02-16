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
            class="d-flex align-center justify-center rounded-r-lg px-4"
            z-index="2"
            :style="
              'background: var(--sourcery-' + (request.status.name == 'Complete' ? '700' : '500') + ')'"
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
        }
    }
}
</script>
