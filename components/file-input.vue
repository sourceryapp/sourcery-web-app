<template>
  <label class="file-container">
    <input class="file-input" type="file">
    <v-icon x-large>mdi mdi-plus</v-icon>
    <p>Add a file</p>
  </label>
</template>

<script>

export default {
    name: 'FileInput',
    data () {
        return {
        }
    },
    computed: {
    },
    mounted () {
    }
}
</script>

<style scoped>
.file-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 4px dashed grey;
  height: 100%;
  cursor: pointer;
}
.file-input {
  opacity: 0;
  visibility: hidden;
  height:0px;
}
</style>
