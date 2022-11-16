import Vue from 'vue'

export default () => {
    Vue.filter('normalDate', function (value) {
        if (!value) { return '' }

        const d = new Date(value)
        return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
    })

    Vue.filter('normalDateAndTime', function (value) {
        if (!value) { return '' }

        const d = new Date(value)
        return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString()}`
    })
}
