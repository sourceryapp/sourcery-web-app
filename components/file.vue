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
        <v-card-title class="text-h5">
          <v-row justify="space-between">
            <v-col cols="9" md="10">
              <EditableText :text="label" @change="updateLabel" />
            </v-col>
            <v-col cols="3" md="2" class="text-right">
              <v-btn color="primary" :loading="deleting" :disabled="deleting" @click="deleteThisAttachment()">
                Delete
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <div>File Type: {{ type() }}</div>
              <div>File Size: {{ humanReadableBytes() }}</div>
            </v-col>
            <v-col cols="12" md="9">
              <v-img
                v-if="attachment.url"
                :src="attachment.url"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="100%"
              />
            </v-col>
          </v-row>
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
import { mapActions } from 'vuex'
import filesize from 'filesize'
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
            showDetails: false,
            attachmentSize: 0,
            deleting: false
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
        /**
        * We don't store the filesize, so...
        */
        fetch(this.attachment.url, {
            method: 'HEAD',
            mode: 'cors',
            cache: 'force-cache'
        }).then((response) => {
            // console.log(response)
            this.attachmentSize = response.headers.get('Content-Length')
        })
    },
    methods: {
        ...mapActions({
            deleteAttachment: 'supabaseRequest/deleteAttachment'
        }),
        updateLabel (val) {
            const a = new Attachment(this.attachment)
            a.label = val
            try {
                a.insert()
            } catch (error) {
                console.error('Couldn\'t Save Label', error)
            }
        },
        humanReadableBytes () {
            return filesize(this.attachmentSize)
        },
        type () {
            return this.attachment.url.substr(this.attachment.url.lastIndexOf('.') + 1).toUpperCase()
        },
        async deleteThisAttachment () {
            this.deleting = true
            if (await this.deleteAttachment(this.attachment)) {
                this.deleting = false
                this.$emit('deleted')
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
