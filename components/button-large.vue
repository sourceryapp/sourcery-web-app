<template>
  <div>
    <v-btn v-if="to" :to="to" block x-large class="text-uppercase gradient-button">
      {{ text }}
    </v-btn>

    <v-btn v-else block x-large class="text-uppercase gradient-button" @click="clickAction">
      {{ text }}
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
    }
}
</script>

<style scoped>
.gradient-button {
    background: linear-gradient(45deg, #654EA3, #431A5A);
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
