<template>
  <div>
    <v-btn v-if="to" :to="to" block x-large class="text-uppercase gradient-button">
      {{ displayText }}
    </v-btn>

    <v-btn v-else block x-large class="text-uppercase gradient-button" @click="clickAction">
      {{ displayText }}
    </v-btn>
  </div>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            default: null
        },
        text: {
            type: String,
            required: true
        },
        clickAction: {
            type: Function,
            default: null
        }
    },
    computed: {
        displayText () {
            if (this.$vuetify?.breakpoint?.mobile) {
                return this.text.replace('and', '&')
            }
            return this.text
        }
    }
}
</script>

<style scoped>
.gradient-button {
    background: linear-gradient(45deg, #654EA3, #431A5A);
    max-width: 100%;
}
</style>

<style>
.theme--light.gradient-button {
    color: white;
}

@media print {
    .gradient-button {
        display: none !important;
    }
}
</style>
