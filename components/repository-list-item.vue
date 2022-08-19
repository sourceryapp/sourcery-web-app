<template>
  <v-list-item two-line @click="selectRepository">
    <v-list-item-content>
      <v-list-item-title>
        {{ titleText }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ subText }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
    props: {
        repository: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    computed: {
        titleText () {
            return this.repository?.organization?.name
        },
        subText () {
            return this.repository?.name
        }
    },
    methods: {
        selectRepository () {
            this.$emit('selected', this.repository)
        }
    }
}
</script>
