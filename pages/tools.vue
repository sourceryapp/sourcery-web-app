<template>
    <div id="page-tools">
        <div>
            <v-container>
                <h1 class="text-h3 font-weight-medium text-center my-16">Tools &amp; Integrations</h1>
                <p class="my-16 readable-text-width mx-auto">Sourcery is designed to work with a variety of tools and integrations to make your archival research workflow as seamless as possible. Below are some of the tools and integrations that we are currently working on or planning to integrate with in the future. If you have a tool or integration that you would like to see Sourcery work with, please let us know!</p>
            </v-container>
        </div>

        <div class="bg-surface-variant py-12">
            <v-container>
                <h2 class="text-h4 mb-2">Mobile App</h2>
                <p class="text-muted text-subtitle mb-6"><em>Find us in the Google Play Store</em></p>
                <p>
                The Sourcery mobile app allows you to request scans of archival materials from your phone or tablet, and can be found on the Google Play Store for Android today. <em>Sourcery will be available on iOS in the future.</em></p>
                <div class="">
                    <IconsGooglePlay />
                </div>
            </v-container>
        </div>

        <div class="py-12">
            <v-container>
                <h2 class="text-h4 mb-2">Bookmarklet</h2>
                <p class="text-muted text-subtitle mb-6"><em>Convert Any Site to a Request</em></p>
                <p class="mb-6">
                    Sourcery's bookmarklet allows you to request a scan of anything you find online with a single click. Just drag the Sourcery bookmarklet to your browser's bookmarks bar, navigate to the page describing the thing you want (e.g. a finding aid entry or catalog record for an undigitized document), and click the bookmarklet. Sourcery will automatically create a request for the page you're viewing, complete with catalog information. All you need to do is click "submit" to send your request to an archivist.
                </p>

                <div class="d-flex flex-column flex-md-row align-items-center">
                    <v-btn class="mb-2" href="javascript:!function(t,n){let o=new URL(&quot;https://gvhzhuifsgdcpwmkjboy.supabase.co/functions/v1/translate&quot;);o.searchParams.append(&quot;url&quot;,n),/^https?:\/\//.test(n)?window.open(o.toString(),&quot;_blank&quot;):alert(&quot;The Sourcery Bookmarklet currently only works on http and https URLs.&quot;)}(0,window.location.href);" color="primary">Request with Sourcery!</v-btn>
                    <span class="text-h5 ms-4"><v-icon class="me-2 d-none d-md-inline">mdi-arrow-left</v-icon><v-icon class="me-2 d-md-none">mdi-arrow-up</v-icon>Drag me to your Bookmarks Bar</span>
                </div>
                
            </v-container>
        </div>


        <div class="bg-surface-variant py-12">
            <v-container>
                <v-row class="mb-4">
                    <v-col cols="12" md="6">
                        <h2 class="text-h4 mb-2">ArchivesSpace</h2>
                        <p class="text-muted text-subtitle mb-6"><em>A Plugin to Generate Sourcery Requests from Resources</em></p>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="pa-2 bg-white">
                            <v-img src="~/assets/ArchivesSpace-Logo.png" width="80%" class="bg-white"></v-img>
                        </div>
                    </v-col>
                </v-row>
                
                <p>
                    Available on Github, Sourcery maintains a simple ArchivesSpace plugin which provides a button on an ArchivesSpace resource page to scaffold a Sourcery request. This plugin is designed to make it easier for researchers to request scans of archival materials from within ArchivesSpace.
                </p>
                <p class="text-subtitle-2">*If you are a registered institution with Sourcery, you can configure this plugin to make requests directly to your management dashboard.  Contact the Sourcery team for details.</p>
                <div class="d-flex align-items-center">
                    <v-btn href="https://github.com/greenhousestudios/sourcery-for-archivesspace" target="_blank">Visit the Github <v-icon class="ms-2">mdi-open-in-new</v-icon></v-btn>
                </div>
            </v-container>
        </div>

        <div class="py-12">
            <v-container>
                <h2 class="text-h4 mb-2">HTML Buttons</h2>
                <p class="text-muted text-subtitle mb-6"><em>The Easiest Way to Link Users to Sourcery</em></p>
                <p>Simply copy the HTML provided into your website code to create a Sourcery branded button.</p>
                <v-card>
                    <v-card-title>Customize Button</v-card-title>

                    <v-card-text>
                        <div class="mb-3">
                            <a id="sourceryButton" :class="customizeButtonLinkClass" :style="customizeButtonInlineStyles.container" href="https://sourceryapp.org/request/create">
                                <span :style="customizeButtonInlineStyles.span">Request with Sourcery</span>
                                <svg height="28" :style="customizeButtonInlineStyles.image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.01 294.33"><defs><component is="style">.cls-1{ {{ customizeButtonInlineStyles.polygon }} }</component></defs><polygon class="cls-1" points="206.1 116.36 277.01 92.86 205.96 70.49 182.6 0 160.36 70.62 89.74 92.86 160.23 116.22 182.6 187.27 206.1 116.36" /><polygon class="cls-1" points="85.81 223.42 138.1 206.08 85.71 189.59 68.48 137.6 52.08 189.69 0 206.08 51.98 223.32 68.48 275.71 85.81 223.42" /><polygon class="cls-1" points="225.96 260.34 259.95 249.07 225.89 238.35 214.69 204.57 204.04 238.41 170.19 249.07 203.97 260.27 214.69 294.33 225.96 260.34" /></svg>
                            </a>
                        </div>
                        

                        <v-switch label="Dark" v-model="customizeButton.dark" color="info" density="compact"></v-switch>
                        <v-switch label="Rounded" v-model="customizeButton.rounded" color="info" density="compact"></v-switch>

                        <p>Button HTML</p>
                        <div>{{ customizeButtonMarkup }}</div>
                    </v-card-text>
                </v-card>

            </v-container>
        </div>

        <div class="bg-surface-variant py-12">
            <v-container>

                <v-row>
                    <v-col cols="12" md="4" align="center">
                        <v-img src="~/assets/tropy-app-icon-256x256.png" class="w-50 w-md-100"></v-img>
                    </v-col>
                    <v-col cols="12" md="8">
                        <h2 class="text-h4 mb-2">Tropy<v-badge content="BETA" inline></v-badge></h2>
                        <p class="text-muted text-subtitle mb-6"><em>Import Records to Your Local Tropy Install</em></p>
                        <p>
                            Sourcery maintains a simple plugin for Tropy to help import records from completed requests.  This integration is in active development, but can be tested via the Github repository.
                        </p>
                        <div class="d-flex align-items-center">
                            <v-btn href="https://github.com/GreenhouseStudios/sourcery-web-app/tree/master/tropy/sourcery" target="_blank">Visit the Github <v-icon class="ms-2">mdi-open-in-new</v-icon></v-btn>
                        </div>
                    </v-col>
                </v-row>

                
            </v-container>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'public'
})


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