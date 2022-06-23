<template>
  <v-btn
    block
    x-large
    class="text-uppercase gradient-button"
    :loading="loading"
    :disabled="loading"
    @click="clickButton()"
  >
    {{ text }}
    <template #loader>
      <span>Loading<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></span>
    </template>
  </v-btn>
</template>

<script>
import { Promise } from 'bluebird'
import JsZip from 'jszip'
// import { Attachment } from '~/models/Attachment'
import { saveAs } from 'file-saver'
import { Request } from '~/models/Request'

export default {
    props: {
        text: {
            type: String,
            required: true
        },
        request: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            loading: false,
            modelRequest: new Request(this.request)
        }
    },
    methods: {
        async clickButton () {
            this.loading = true
            await this.exportZipFile()
            this.loading = false
        },
        downloadByGroup (attachments, filesPerGroup = 5) {
            return Promise.map(
                attachments,
                async (attachment) => {
                    const blob = await attachment.getDownloadBlob()
                    return {
                        blob,
                        attachment
                    }
                },
                {
                    concurrency: filesPerGroup
                }
            )
        },
        async exportZipFile () {
            if (!this.request?.attachments) {
                return false
            }

            const attachmentMeta = await this.downloadByGroup(this.request.attachments, 5)

            const zip = JsZip()
            attachmentMeta.forEach(({ blob, attachment }, i) => {
                zip.file(attachment.getFileNameAndExtension(), blob)
            })

            const z = await zip.generateAsync({ type: 'blob' })

            const fileName = `request-${this.request.id}-files.zip`
            return saveAs(z, fileName)
        }
    }
}
</script>

<style scoped>
.gradient-button {
    background: linear-gradient(45deg, #654EA3, #431A5A);
}
</style>

<style>
.theme--light.gradient-button {
    color: white;
}

.dot {
    position: relative;
    display: inline-block;
    animation: dotVertical 1.2s infinite linear;
}

.dot2 {
    animation-delay: 0.2s;
}

.dot3 {
    animation-delay: 0.4s;
}

@keyframes dotVertical {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-3px);
    }
    100% {
        transform: translateY(0px);
    }
}
</style>
