import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const is_dark = localStorage.getItem('dark_theme')
    let dark_theme = false
    if (is_dark !== undefined) {
        if (is_dark === 'true') {
           dark_theme = true
        } else {
            dark_theme = false
        }
    } else {
        localStorage.setItem('dark_theme', mq.matches.toString())
        dark_theme = localStorage.getItem('dark_theme') === "true" ? true : false
    }


    const vuetify = createVuetify({
        theme: {
            defaultTheme: dark_theme ? 'dark' : 'light',
            themes: {
                light: {
                    colors: {
                        primary: '#654EA3',
                        secondary: '#4E4B51',
                        accent: '#53AFAC',
                        error: '#b71c1c'
                    }
                },
                dark: {
                    colors: {
                        primary: '#c5aeef',
                        secondary: '#2f2740'
                    }
                }
            }
        }
    })


    app.vueApp.use(vuetify)
})