<template>
  <v-hover
    v-slot="{ hover }"
    :key="request.id"
  >
    <v-card
      v-if="request && !request.request().isArchived()"
      :to="'/request/' + request.id"
      class="my-4 rounded-lg"
      outlined
    >
      <v-container>
        <v-row>
          <v-col class="pa-0">
            <v-card-title>
              {{ request.data().label }}
            </v-card-title>
            <v-card-subtitle>
              {{ request.data().citation }}
              <br>
              {{ request.data().repository.name }}
              <!-- {{ request.data().repository.name + ' - ' + request.data().repository.city + ', ' + request.data().repository.state }} -->
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
              'background: var(--sourcery-' + (request.request().prettyStatus() == 'Complete' ? '700' : '500') + ')'"
          >
            <p
              class="font-weight-bold text-button ma-0"
              :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
            >
              {{ request.request().prettyStatus() }}
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
        }
    }
}
</script>
