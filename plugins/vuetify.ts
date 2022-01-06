import { Framework } from 'vuetify'

// Required for proper $vuetify object typing.
// @link https://github.com/nuxt/nuxt.js/issues/6015
declare module 'vue/types/vue' {
    interface Vue {
        $vuetify: Framework
    }
}

// Uncomment to enable system matching dark mode (requires some rework in other areas)
export default function ({ $vuetify }: { $vuetify: Framework }) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const theme = localStorage.getItem('dark_theme')
    if (theme) {
        if (theme === 'true') {
            $vuetify.theme.dark = true
        } else {
            $vuetify.theme.dark = false
        }
    } else {
        localStorage.setItem('dark_theme', mq.matches.toString())
        $vuetify.theme.dark = localStorage.getItem('dark_theme') === "true" ? true : false
    }
}
