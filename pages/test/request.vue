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
      <p v-if="selectedRepository">
        Currently requesting from {{ selectedRepository.name }} - {{ selectedRepository.organization.name }}
      </p>
      <v-form ref="createRequestForm" v-model="formValid" lazy-validation>
        <v-text-field
          v-model="formValues.name"
          label="Your name*"
          outlined
          required
          :rules="[$sourceryForms.rules.required]"
        />
        <v-text-field
          label="Your Email"
          outlined
          readonly
          disabled
          :value="user.email"
        />
        <v-text-field
          v-model="formValues.title"
          label="Request Title*"
          outlined
          required
          :rules="[$sourceryForms.rules.required]"
        />
        <p>Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collections, etc.). Citations are appreciated but not necessary!</p>
        <v-textarea
          v-model="formValues.details"
          label="Request Details"
          outlined
          placeholder="Type spells, potions, information, and citations (if you have them) here…"
          required
          :rules="[$sourceryForms.rules.required, $sourceryForms.rules.largeTextAreaCounter]"
        />

        <div class="d-flex justify-space-between my-1 mb-5">
          <v-btn class="px-4" to="/dashboard">
            Back
          </v-btn>
          <v-btn class="px-4" color="primary" :disabled="!submitEnabled" @click="submitRequest">
            Submit
          </v-btn>
        </div>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
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
            selectedRepository: null,
            formValid: true,
            formValues: {
                name: '',
                title: '',
                details: ''
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        submitEnabled () {
            return this.selectedRepository?.id && this.$refs.formValid
        }
    },
    methods: {
        repositorySelected (repository) {
            this.selectedRepository = repository
        },
        submitRequest () {
            this.$toast.success('Submitted Request!')
        }
    }
}
</script>
