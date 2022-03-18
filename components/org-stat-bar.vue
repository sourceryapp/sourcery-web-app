<template>
  <div class="org-stat-bar mb-6">
    <v-card class="pt-1 pb-1 pr-3 pl-2">
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
    props: {
        newCount: {
            type: Number,
            default: 0
        },
        progressCount: {
            type: Number,
            default: 0
        },
        completedCount: {
            type: Number,
            default: 0
        },
        turnaroundDays: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
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
                    name: 'Completed/Archived',
                    key: 'completed'
                },
                {
                    name: 'Avg Turnaround',
                    key: 'avg_turnaround'
                }
            ]
        }
    },
    computed: {
        stats () {
            return {
                new: this.newCount,
                progress: this.progressCount,
                completed: this.completedCount,
                avg_turnaround: `${this.turnaroundDays} days`
            }
        }
    }
}
</script>

<style scoped>
.stat-large {
    font-size: 3.5em;
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
