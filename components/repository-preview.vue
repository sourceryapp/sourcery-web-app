<template>
  <div v-if="repository" class="repository-preview mb-4 mt-2">
    <v-img
      :src="featuredImageUrl"
      max-height="200"
      class="repository-image"
    >
      <div class="fill-height grey-gradient" />
    </v-img>
    <p class="title-text mt-2 mb-0">
      {{ repository.organization?.name }}
      <v-btn icon>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </p>
    <p class="subtitle-text mb-0">
      {{ repository.name }}
    </p>
    <p class="supporting-text mb-0">
      {{ addressLine }}
    </p>
  </div>
</template>

<script>
export default {
    props: {
        repository: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        addressLine () {
            if (this.repository) {
                let address = `${this.repository.address1}`
                if (this.repository.address2) {
                    address += `, ${this.repository.address2}`
                }
                address += `, ${this.repository.city}, ${this.repository.state}`
                return address
            }
            return ''
        },
        featuredImageUrl () {
            if (this.repository?.featured_image?.url) {
                return this.repository.featured_image.url
            }
            return '/img/fallbacks/default-header.jpg'
        }
    }
}
</script>

<style lang="scss" scoped>
.grey-gradient {
    background-color: rgba(0,0,0,0.2)
}

.title-text {
    font-size: 24px;
    font-weight: 500;
}

.subtitle-text {
    font-size: 16px;
    font-weight: 500;
}

.supporting-text {
    font-size: 16px;
    font-weight: 300;
}
</style>

<style>
.repository-preview .v-image__image {
    border-radius: 5px;
}
</style>
