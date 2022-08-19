<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-3">
        Create a Request
      </h1>
      <h2 class="mb-3">
        Select Repository
      </h2>

      <repository-preview :repository="selectedRepository" />

      <repository-search @selected="repositorySelected" />

      <h2 class="mt-5 mb-3">
        Document Information
      </h2>
      <p>Currently requesting from ...</p>
      <v-text-field label="Your name*" outlined />
      <v-text-field label="Request Title*" outlined />
      <p>Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collections, etc.). Citations are appreciated but not necessary!</p>
      <v-textarea label="Request Details" outlined placeholder="Type spells, potions, information, and citations (if you have them) here…" />
    </v-flex>
  </v-layout>
</template>

<script>
import { Repository } from '~/models/Repository'

export default {
    async asyncData ({ store }) {
        const repositories = await Repository.getActive()

        return {
            repositories
        }
    },
    data () {
        return {
            repositories: [],
            selectedRepository: null
        }
    },
    methods: {
        repositorySelected (repository) {
            this.selectedRepository = repository
        }
    }
}
</script>
