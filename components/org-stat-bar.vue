<template>
  <div class="org-stat-bar">
    <v-card class="pt-1 pb-1 pr-4 pl-4">
      <v-card-text>
        <v-row>
          <v-col v-for="label in labels" :key="`l-${label.key}`" class="split-border mt-1 mb-2 pl-6">
            <p class="mb-6">
              {{ label.name }}
            </p>
            <span class="stat-large">{{ stats[label.key] }}</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
    data () {
        return {
            stats: {
                new: 0,
                progress: 57,
                completed: 243,
                revenue: '$0'
            },
            labels: [
                {
                    name: 'New',
                    key: 'new'
                },
                {
                    name: 'In-Progress',
                    key: 'progress'
                },
                {
                    name: 'Completed',
                    key: 'completed'
                },
                {
                    name: 'Revenue',
                    key: 'revenue'
                }
            ]
        }
    }
}
</script>

<style scoped>
.stat-large {
    font-size: 4em;
    font-weight: bold;
}

.split-border:not(:first-child) {
    border-left: 2px solid rgba(255, 255, 255, 0.7);
}
</style>

<style>
.theme--light.v-card .split-border {
    border-color: black;
}
</style>
