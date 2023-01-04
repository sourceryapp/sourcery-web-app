<template>
  <div class="repository-search mb-4">
    <v-autocomplete
      v-model="selectedRepository"
      outlined
      placeholder="Search or Enter New Repositories..."
      :items="repositories"
      item-text="organization.name"
      :search-input.sync="searchText"
      return-object
      @input="selectedRepositoryItem"
    >
      <template #no-data>
        <v-list-item @click="selectCreateNewRepository">
          <v-list-item-content>
            <v-list-item-title>
              Submit New Repository: {{ searchText }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <em>User Custom Entry</em>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template #item="{ item }">
        <v-list-item-content>
          <v-list-item-title>
            {{ item.organization.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ item.name }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>

    <div class="repository-item-list">
      <repository-list-item v-for="repo in visibleRepositories" :key="repo.id" :repository="repo" @selected="selectedRepositoryItem" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Repository } from '~/models/Repository'

export default {
    data () {
        return {
            repositories: [],
            selectedRepository: null,
            searchText: ''
        }
    },
    async fetch () {
        const repositories = [
            ...await Repository.getActive(),
            ...await Repository.getGhost(),
            ...await Repository.getOwned(this.userOrganizationIds)
        ]
        // Remove duplicates
        this.repositories = [...new Map(repositories.map(m => [m.id, m])).values()]
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            isAdmin: 'supabaseAuth/isAdmin',
            userOrganizationIds: 'supabaseAuth/userOrganizationIds'
        }),
        visibleRepositories () {
            // Currently simple search.
            return this.repositories.filter((x) => {
                // const search_string = `${x.name} ${x.organization.name} ${x.address1} ${x.address2} ${x.city} ${x.state} ${x.postal_code}`

                if (this.$utils.isTestUser(this.authUser)) {
                    if (this.$utils.isATestOrganization(x.organization)) {
                        return true
                    }
                    return false
                }

                if (!this.$utils.isATestOrganization(x.organization)) {
                    return true
                }

                return this.isAdmin
            })
        }
    },
    methods: {
        selectedRepositoryItem (repository) {
            this.$emit('selected', repository)
        },
        selectCreateNewRepository () {
            this.$toast.success('Creating new! ' + this.searchText)
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
