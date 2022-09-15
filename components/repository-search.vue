<template>
  <div class="repository-search mb-4">
    <v-text-field
      v-model="searchTerm"
      outlined
      placeholder="Search Repositories..."
    />

    <div class="repository-item-list">
      <repository-list-item v-for="repo in visibleRepositories" :key="repo.id" :repository="repo" @selected="selectedRepositoryItem" />
    </div>
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
                const search_string = `${x.name} ${x.organization.name} ${x.address1} ${x.address2} ${x.city} ${x.state} ${x.postal_code}`
                return search_string.toLowerCase().includes(this.searchTerm.toLowerCase())
            })
        }
    },
    methods: {
        selectedRepositoryItem (repository) {
            this.$emit('selected', repository)
        }
    }
}
</script>

<style lang="scss">
.theme--dark {
    .repository-item-list {
        border-color: rgba(255, 255, 255, 0.24);
    }
}
.repository-item-list {
    column-count: 2;
    border: 1px solid rgba(0, 0, 0, 0.38);
    border-radius: 10px;
    padding: 20px 40px;
    * {
        break-inside: avoid-column;
    }
}
</style>
