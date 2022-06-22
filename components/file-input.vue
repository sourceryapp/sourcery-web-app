<template>
  <label class="file-container">
    <input
      ref="fileInput"
      class="file-input"
      type="file"
      :accept="accept"
      :capture="capture"
      :multiple="multiple"
      @change="changed"
    >
    <v-btn
      class="ma-2 white--text"
      :color="color"
      @click="triggerDefaultAction"
    >
      {{ text }}
      <v-icon right dark>
        {{ icon }}
      </v-icon>
    </v-btn>
  </label>
</template>

<script>

export default {
    name: 'FileInput',
    props: {
        icon: {
            type: String,
            required: false,
            default: 'mdi-cloud-upload'
        },
        color: {
            type: String,
            required: false,
            default: 'primary'
        },
        text: {
            type: String,
            required: false,
            default: 'Upload File'
        },
        accept: {
            type: String,
            required: false,
            default: '.png, .jpg, .jpeg, .tif, .tiff, .pdf'
        },
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture
        capture: {
            type: [String, Boolean],
            required: false,
            default: undefined
        },
        multiple: {
            type: [String, Boolean],
            required: false,
            default: undefined
        }
    },
    data () {
        return {
            // See FileList: https://developer.mozilla.org/en-US/docs/Web/API/FileList
            // and File: https://developer.mozilla.org/en-US/docs/Web/API/File
            fileList: undefined
        }
    },
    computed: {
    },
    mounted () {
        // const fileInput = document.querySelector('.file-input')
        // console.log('File Input', fileInput)
        // fileInput.addEventListener('change', () => {
        //     console.log('value changed')
        // })
        // fileInput.addEventListener('click', () => {
        //     console.log('input clicked')
        // })
    },
    methods: {
        changed (event) {
            this.fileList = event.target.files
            this.$emit('change', this.fileList)
        },
        // Triggers the default action of the input[file] element
        triggerDefaultAction () {
            this.$refs.fileInput.click()
        }

    }
}
</script>

<style scoped>
.file-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.file-input {
  opacity: 0;
  visibility: hidden;
  height:0px;
}
</style>
