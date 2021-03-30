module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:vue/base',
        'plugin:nuxt/base'
    ],
    plugins: [
        'vuetify'
    ],
    // add your custom rules here
    rules: {
        indent: ['error', 4],
        'no-console': 'off',
        eqeqeq: ['error', 'smart'],
        camelcase: 'off', // TODO Enforce camelcase naming
        'vue/no-v-html': 'off',
        'vue/attribute-hyphenation': 'off',
        'vuetify/no-deprecated-classes': 'error'
    },
    ignorePatterns: ['/tests/', '/static/'] // Disable these for now
}
