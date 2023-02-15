<template>
  <div class="repository-search mb-4">
    <v-autocomplete
      ref="repository_search_auto"
      v-model="selectedRepository"
      outlined
      placeholder="Search or Enter New Repositories..."
      :items="repositories"
      item-text="organization.name"
      :search-input.sync="searchText"
      return-object
      :menu-props="{
        closeOnContentClick: true
      }"
      hide-details
      class="mb-4"
      @input="selectedRepositoryItem"
      @keyup.13="selectCreateNewRepository"
    >
      <template #prepend-item>
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
      <template #no-data>
        <v-list-item class="no-data-menu-item" @click="selectCreateNewRepository">
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

    <repository-preview :repository="selectedRepository" @unselect="unselect" />

    <div v-if="isCustom" class="location-clarification mb-8">
      <h3 class="font-weight-medium mb-3">
        Let's make sure you're spell is clear.
      </h3>
      <v-text-field label="What is the town, state, and country this repository is located in?*" placeholder="What is the town, state, and country this repository is located in?*" outlined class="mb-4" hide-details />
    </div>

    <div class="repository-item-list mt-2">
      <div class="repository-item-list-filter-row">
        <span class="browse-text text-h5 font-weight-light text-uppercase">Browse</span>
        <v-btn icon @click="toggleBrowse">
          <v-icon>{{ toggleBrowseIcon }}</v-icon>
        </v-btn>
      </div>
      <div v-if="browseOpen" class="repository-item-list-items">
        <repository-list-item v-for="repo in visibleRepositories" :key="repo.id" :repository="repo" @selected="selectedRepositoryItem" />
      </div>
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
            searchText: '',
            browseOpen: true,
            isCustom: false
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
        },
        toggleBrowseIcon () {
            if (this.browseOpen) {
                return 'mdi-menu-down'
            }
            return 'mdi-menu-up'
        }
    },
    methods: {
        selectedRepositoryItem (repository) {
            this.isCustom = false
            this.selectedRepository = repository
            this.$emit('selected', repository)
            this.setBrowse(false)
        },
        selectCreateNewRepository () {
            this.isCustom = true
            this.selectedRepository = this.searchText
            this.$emit('selected', this.searchText)
            this.$refs.repository_search_auto.blur()
            this.setBrowse(false)
        },
        toggleBrowse () {
            this.browseOpen = !this.browseOpen
        },
        setBrowse (bool = true) {
            this.browseOpen = !!bool
        },
        unselect () {
            this.selectedRepository = null
            this.$emit('selected', null)
            this.setBrowse(true)
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
    border: 1px solid rgba(0, 0, 0, 0.38);
    border-radius: 4px;
    padding: 16px 32px;
    margin-top: 4px;
    * {
        break-inside: avoid-column;
    }

    .repository-item-list-filter-row {
        width: 100%;
        display:flex;

        .browse-text {
            align-self: center;
        }
    }

    .repository-item-list-items {
        column-count: 2;
        padding-top: 10px;
    }
}

.repository-search {
    .v-text-field__details {
        display: none;
    }
}

.no-data-menu-item {
    display: none;
}

.location-clarification {
  h3 {
    font-size: 22px;
  }
}
</style>
