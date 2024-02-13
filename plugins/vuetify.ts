import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
      // ... your configuration
    })

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const theme = localStorage.getItem('dark_theme')
    if (theme) {
        if (theme === 'true') {
            vuetify.theme.dark = true
        } else {
            vuetify.theme.dark = false
        }
    } else {
        localStorage.setItem('dark_theme', mq.matches.toString())
        vuetify.theme.dark = localStorage.getItem('dark_theme') === "true" ? true : false
    }
    app.vueApp.use(vuetify)
})