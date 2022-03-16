<template>
  <v-card
    flat
    tile
    class="mb-4 rounded-lg pt-4 pb-3 pl-2 pr-2"
  >
    <v-card-title>
      <span class="text-uppercase text-h5">{{ titleText }}</span>
      <v-spacer />
      <span class="text-subtitle-1">More -></span>
    </v-card-title>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'CardWithAction',
    props: {
        title: {
            type: String,
            required: true
        },
        numberRequests: {
            type: Number,
            default: 0
        }
    },
    computed: {
        titleText () {
            let title = this.title
            if (this.numberRequests) {
                title += ` (${this.numberRequests})`
            }
            return title
        }
    }
}
</script>
