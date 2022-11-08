<template>
  <button class="request-with-sourcery-btn" :style="styleTagText">
    Request with Sourcery
    <img :style="imageStyleTagText" src="~/assets/sourcery-button_stars.svg">
  </button>
</template>

<script>
export default {
    props: {
        dark: {
            type: Boolean,
            default: true
        },
        rounded: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        styleTagText () {
            let styles = 'font-size: 14px;padding: 10px 15px;font-family: sans-serif;border: 1px solid black;font-weight: bold; line-height: 1; vertical-align: middle;'

            if (this.dark) {
                styles += 'color: white; background-color: black; border-color: white;'
            } else {
                styles += 'color: black; background-color: white; border-color: black;'
            }

            if (this.rounded) {
                styles += 'border-radius: 20px;'
            } else {
                styles += 'border-radius: 5px;'
            }

            return styles
        },
        imageStyleTagText () {
            const styles = 'height: 20px; width: 20px; line-height: 1;vertical-align: middle; margin-left:5px;'
            return styles
        },
        markup () {
            return `<button class="request-with-sourcery-btn" style="${this.styleTagText}">
                    Request with Sourcery
                    <img style="${this.imageStyleTagText}" src="~/assets/sourcery-button_stars.svg">
                </button>`
        }
    }
}
</script>
