<template>
  <v-btn :to="to" block x-large class="text-uppercase gradient-button">
    {{ text }}
  </v-btn>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.gradient-button {
    background: linear-gradient(45deg, #654EA3, #431A5A);
}
</style>
