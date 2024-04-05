<template>
    <div id="page-brand-resources" class="py-10">
        <v-container>
            <h1 class="text-center mb-14 page-title">Brand Resources</h1>

            <v-row>
                <v-col md="6" offset-md="3">
                    <v-card>
                        <v-card-title>Customize Button</v-card-title>

                        <v-card-text>
                            <a id="sourceryButton" :class="customizeButtonLinkClass" :style="customizeButtonInlineStyles.container" href="https://sourceryapp.org">
                                <span :style="customizeButtonInlineStyles.span">Request with Sourcery</span>
                                <svg height="28" :style="customizeButtonInlineStyles.image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.01 294.33"><defs><component is="style">.cls-1{ {{ customizeButtonInlineStyles.polygon }} }</component></defs><polygon class="cls-1" points="206.1 116.36 277.01 92.86 205.96 70.49 182.6 0 160.36 70.62 89.74 92.86 160.23 116.22 182.6 187.27 206.1 116.36" /><polygon class="cls-1" points="85.81 223.42 138.1 206.08 85.71 189.59 68.48 137.6 52.08 189.69 0 206.08 51.98 223.32 68.48 275.71 85.81 223.42" /><polygon class="cls-1" points="225.96 260.34 259.95 249.07 225.89 238.35 214.69 204.57 204.04 238.41 170.19 249.07 203.97 260.27 214.69 294.33 225.96 260.34" /></svg>
                            </a>
                        </v-card-text>

                        <v-card-text>
                            <v-switch label="Dark" v-model="customizeButton.dark" color="info"></v-switch>
                            <v-switch label="Rounded" v-model="customizeButton.rounded" color="info"></v-switch>
                        </v-card-text>

                        <v-card-text>
                            <p>Button HTML</p>
                            <div>{{ customizeButtonMarkup }}</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
const customizeButton = ref({
    dark: false,
    rounded: false
})

const customizeButtonMarkup = ref('')

const customizeButtonLinkClass = computed(() => {
    let c = 'request-with-sourcery-btn'
    if (customizeButton.value.dark) {
        c += ' sourcery-btn-dark'
    }
    return c
})

const customizeButtonInlineStyles = computed(() => {
    const styles = {
        container: 'font-size: 14px;font-family: sans-serif;border: 1px solid black;font-weight: bold; text-decoration: none; box-sizing: border-box; text-align: center; display: inline-flex; align-items: center; justify-content: space-between;',
        span: 'padding: 6px 0px; line-height: 22px;',
        image: 'line-height: 1;margin-left:11px;',
        polygon: 'fill: ',
        hover: ''
    }

    if (customizeButton.value.dark) {
        styles.container += 'color: white; background-color: #1e1e1e;; border-color: white;'
        styles.hover += '.request-with-sourcery-btn.sourcery-btn-dark:hover{background-color: #3f3f3f!important;}'
        styles.polygon += 'white;'
    } else {
        styles.container += 'color: black; background-color: white; border-color: #1e1e1e;'
        styles.hover += '.request-with-sourcery-btn:hover{background-color: #ededed!important;border-color: #ededed!important;}'
        styles.polygon += '#333;'
    }

    if (customizeButton.value.rounded) {
        styles.container += 'border-radius: 20px; padding: 3px 20px;'
    } else {
        styles.container += 'border-radius: 5px; padding: 3px 15px;'
    }

    return styles
})

function generateMarkup() {
    const el = document.getElementById('sourceryButton')
    if (el) {
        customizeButtonMarkup.value = el.outerHTML
        return
    }
    customizeButtonMarkup.value = ''
}

watch(customizeButton, () => {
    generateMarkup()
}, { deep: true })

onMounted(() => {
    generateMarkup()
})
</script>