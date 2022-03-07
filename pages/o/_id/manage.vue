<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        Manage Organization
      </h1>

      <sourcery-card title="Change Organization Image" icon="mdi-file-image">
        <pre>{{ organization }}</pre>
        <figure v-if="orgHasFeaturedImage">
          <v-img
            :src="orgFeaturedImageUrl"
            aspect-ratio="1"
            class="grey lighten-2"
          />
        </figure>
        <p v-else class="ml-3 mt-3">
          No featured image yet.
        </p>
        <v-form ref="orgUploadForm" enctype="multipart/form-data" novalidate @submit.prevent="saveOrgPhoto()">
          <input
            type="file"
            name="orgUploadFileField"
            :disabled="isSaving"
            accept="image/*"
            class="input-file"
          >
          <v-btn type="submit" :loading="isSaving" :disabled="isSaving" color="primary">
            Upload
          </v-btn>
        </v-form>
      </sourcery-card>

      <sourcery-card title="Change Repository Images" icon="mdi-image-multiple">
        <p>Forms here.</p>
        <v-list>
          <v-list-item v-for="repo in organization.repositories" :key="`org-repo-${repo.id}`">
            <p>{{ repo.name }}</p>
          </v-list-item>
        </v-list>
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import SourceryCard from '~/components/card-with-header.vue'
import { Organization } from '~/models/Organization'

export default {
    components: {
        SourceryCard
    },
    async asyncData ({ params }) {
        const organization = await Organization.getBySlug(params.id)

        return {
            organization
        }
    },
    data () {
        return {
            isSaving: false
        }
    },
    computed: {
        orgHasFeaturedImage () {
            return !!this.organization?.featured_images.length > 0
        },
        orgFeaturedImageUrl () {
            return this.organization?.featured_images[0].url
        }
    }
}
</script>
