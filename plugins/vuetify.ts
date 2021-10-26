// Uncomment to enable system matching dark mode (requires some rework in other areas)
export default function ({ $vuetify }) {
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
        $vuetify.theme.dark = localStorage.getItem('dark_theme')
        // $vuetify.theme.dark = mq.matches
        // mq.addEventListener('change', (e) => {
        //     $vuetify.theme.dark = e.matches
        // })
    }
}
