<template>
  <div class="chat-card-viewport">
    <div class="chat-card-container">
      <v-card max-width="500" class="chat-card">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Chat with an Archivist
            </v-list-item-title>
            <v-list-item-subtitle>Request #300 - UConn Archives &amp; Special Collections</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="toggleOpen">
              <v-icon>{{ icon }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            open: true
        }
    },
    computed: {
        icon () {
            if (this.open) {
                return 'mdi-close'
            }
            return 'mdi-chevron-up'
        }
    },
    methods: {
        toggleOpen () {
            this.open = !this.open
        }
    }
}
</script>

<style lang="scss" scoped>
.chat-card-viewport {
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 99999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .chat-card-container {
        position: absolute;
        bottom: 0;
        right: 20%;
        z-index: 999999;
        pointer-events: auto;

        .chat-card {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            background: linear-gradient(45deg, #654EA3, #431A5A);
        }
    }
}

</style>
