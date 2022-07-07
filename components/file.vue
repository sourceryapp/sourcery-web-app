<template>
  <div>
    <v-dialog v-model="showDetails" width="80%">
      <template #activator="{ on, attrs }">
        <v-img
          v-if="attachment.url"
          :src="attachment.url"
          aspect-ratio="1"
          class="grey lighten-2 pointer"
          max-width="100%"
          v-bind="attrs"
          v-on="on"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          <EditableText :text="label" @change="updateLabel" />
        </v-card-title>

        <v-card-text>
          <v-img v-if="attachment.url" :src="attachment.url" aspect-ratio="1" class="grey lighten-2" max-width="100%" />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showDetails = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Attachment } from '~/models/Attachment'
export default {
    name: 'File',
    props: {
        attachment: {
            type: Attachment,
            required: true,
            default: {}
        }
    },
    data () {
        return {
            showDetails: false
        }
    },
    computed: {
        label () {
            if (this.attachment.label !== '') {
                return this.attachment.label
            } else {
                const url = this.attachment.url
                return url.substring(url.lastIndexOf('/') + 1)
            }
        }
    },
    mounted () {
    },
    methods: {
        updateLabel (val) {
            const a = new Attachment(this.attachment)
            a.label = val
            try {
                a.insert()
            } catch (error) {
                console.error('Couldn\'t Save Label', error)
            }
        }
    }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
