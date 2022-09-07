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

      <repository-search @selected="setRepository" />

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
          v-model="label"
          label="Request Title*"
          outlined
          required
          :rules="[$sourceryForms.rules.required]"
        />
        <p>Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collections, etc.). Citations are appreciated but not necessary!</p>
        <v-textarea
          v-model="citation"
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
import { mapGetters, mapMutations } from 'vuex'
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
            formValid: true,
            formValues: {
                name: ''
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            getSelectedRepository: 'supabaseCreate/repository',
            getLabel: 'supabaseCreate/label',
            getCitation: 'supabaseCreate/citation'
        }),
        selectedRepository: {
            get () {
                return this.getSelectedRepository
            },
            set (val) {
                this.setRepository(val)
            }
        },
        label: {
            get () {
                return this.getLabel
            },
            set (val) {
                this.setLabel(val)
            }
        },
        citation: {
            get () {
                return this.getCitation
            },
            set (val) {
                this.setCitation(val)
            }
        },
        submitEnabled () {
            return this.selectedRepository?.id && this.$refs.formValid
        }
    },
    methods: {
        ...mapMutations({
            setRepository: 'supabaseCreate/setRepository',
            setLabel: 'supabaseCreate/setLabel',
            setCitation: 'supabaseCreate/setCitation'
        }),
        submitRequest () {
            this.$toast.success('Submitted Request!')
        }
    }
}
</script>
