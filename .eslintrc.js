module.exports = {
    root: true,
    globals: {
        process: true
    },
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/base'
    ],
    plugins: [
    ],
    // add your custom rules here
    rules: {
        indent: ['error', 4],
        'no-import-assign': 'warn',
        'no-console': 'off',
        eqeqeq: ['error', 'smart'],
        camelcase: 'off', // TODO Enforce camelcase naming
        'vue/no-v-html': 'off',
        'vue/attribute-hyphenation': 'off'
    },
    ignorePatterns: ['/tests/', '/static/'] // Disable these for now
}
