<template>
  <div class="repository-search mb-4">
    <v-text-field
      v-model="searchTerm"
      outlined
      placeholder="Search Repositories..."
    />

    <v-list>
      <v-list-item v-for="repo in visibleRepositories" :key="repo.id" two-line>
        <v-list-item-content>
          <v-list-item-title>
            {{ repo.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ repo.address1 }}, {{ repo.address2 }}, {{ repo.city }}, {{ repo.state }}, {{ repo.postal_code }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { Repository } from '~/models/Repository'

export default {
    data () {
        return {
            repositories: [],
            searchTerm: ''
        }
    },
    async fetch () {
        this.repositories = await Repository.getActive()
    },
    computed: {
        visibleRepositories () {
            // Currently simple search.
            return this.repositories.filter((x) => {
                const search_string = `${x.name} ${x.address1} ${x.address2} ${x.city} ${x.state} ${x.postal_code}`
                return search_string.toLowerCase().includes(this.searchTerm.toLowerCase())
            })
        }
    }
}
</script>
