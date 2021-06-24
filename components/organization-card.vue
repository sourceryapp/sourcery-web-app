<template>
  <v-item v-slot="{ toggle }">
    <v-card outlined class="mb-2" @click="toggle">
      <v-img
        :src="`/img/org/${organization.id}.jpg`"
        class="align-stretch"
        gradient="135deg, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.7) 100%"
        width="100%"
        aspect-ratio="4"
        min-height="180px"
      >
        <v-container class="fill-height">
          <v-row>
            <v-col class="d-flex justify-end">
              <img
                v-if="organization.show_org_photo"
                :src="`/img/institution/${organization.id}.png`"
                alt="alt"
                height="48px"
              >
            </v-col>
          </v-row>
          <v-row class="align-self-end">
            <v-col class="pa-0">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="text-h5 white--text">
                    {{ organization.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2 white--text">
                    {{ organization.address }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="2" class="d-flex flex-row-reverse align-end">
              <v-btn
                color="white"
                class="black--text"
                :to="to"
              >
                View
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-card>
  </v-item>
</template>

<script>
export default {
    name: 'OrganizationCard',
    props: {
        organization: {
            type: Object,
            required: true
        }
    },
    computed: {
        to () {
            if (this.organization.slug) {
                return '/o/' + this.organization.slug
            }
            return '/o/' + this.organization.id
        }
    }
}
</script>
