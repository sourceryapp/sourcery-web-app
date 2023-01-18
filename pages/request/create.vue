<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-3">
        Create a Request
      </h1>
      <h2 class="mb-3">
        Select Repository
      </h2>

      <v-img
        src="/img/fallbacks/default-header-80opat.jpg"
        max-height="200"
        class="repository-image mb-6 rounded-lg"
      />

      <repository-search @selected="setRepository" />

      <h2 class="mt-5 mb-3">
        Document Information
      </h2>
      <p v-if="selectedRepository">
        Currently requesting from {{ currentlyRequestingFromText }}
      </p>
      <v-form ref="createRequestForm" v-model="formValid" lazy-validation>
        <v-text-field
          v-model="clientName"
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
          :value="clientEmail"
        />
        <v-text-field
          v-model="label"
          label="Request Title*"
          outlined
          required
          :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount100]"
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
          <v-btn class="px-4" color="primary" :disabled="!submitEnabled" @click="submitRequestInsert">
            Submit
          </v-btn>
        </div>
      </v-form>
      </v-img>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
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
            submitting: false
        }
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            authUserMeta: 'supabaseAuth/authUserMeta',
            getSelectedRepository: 'supabaseCreate/repository',
            getLabel: 'supabaseCreate/label',
            getCitation: 'supabaseCreate/citation',
            getClientName: 'supabaseCreate/clientName',
            getClient: 'supabaseCreate/client',
            getClientEmail: 'supabaseCreate/clientEmail'
        }),
        clientEmail () {
            return this.getClientEmail
        },
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
        clientName: {
            get () {
                return this.getClientName
            },
            set (val) {
                this.setClientName(val)
            }
        },
        submitEnabled () {
            return this.selectedRepository?.id &&
              this.formValid &&
              this.citation &&
              !this.submitting
        },
        currentlyRequestingFromText () {
            if (!this.selectedRepository) {
                return ''
            }
            if (typeof this.selectedRepository === 'string') {
                return this.selectedRepository
            }
            return `${this.selectedRepository.name} - ${this.selectedRepository.organization.name}`
        }
    },
    mounted () {
        this.setClient(this.authUser)
        if (this.authUserMeta?.name) {
            this.clientName = this.authUserMeta.name
        }
    },
    methods: {
        ...mapMutations({
            setRepository: 'supabaseCreate/setRepository',
            setLabel: 'supabaseCreate/setLabel',
            setCitation: 'supabaseCreate/setCitation',
            setClientName: 'supabaseCreate/setClientName',
            setClient: 'supabaseCreate/setClient'
        }),
        ...mapActions({
            submitRequest: 'supabaseCreate/insert'
        }),
        submitRequestInsert () {
            // this.submitting = true
            this.$toast.success('Successful, but disabled in this test.')
            // const r = await this.submitRequest()
            // this.submitting = false
            // if (r[0] && r[0].id) {
            //     this.$router.push(`/request/${r[0].id}`)
            // }
        }
    }
}
</script>
