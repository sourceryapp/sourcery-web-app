<template>
  <v-btn
    block
    x-large
    class="text-uppercase gradient-button"
    :loading="loading"
    :disabled="loading"
    @click="clickButton"
  >
    {{ text }}
    <template #loader>
      <span>Loading<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></span>
    </template>
  </v-btn>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            loading: false
        }
    },
    methods: {
        clickButton () {
            this.loading = !this.loading
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

.dot {
    position: relative;
    display: inline-block;
    animation: dotVertical 1.2s infinite linear;
}

.dot2 {
    animation-delay: 0.2s;
}

.dot3 {
    animation-delay: 0.4s;
}

@keyframes dotVertical {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-3px);
    }
    100% {
        transform: translateY(0px);
    }
}
</style>
