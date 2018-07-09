const path = require('path');

let env = require('./config/development.js')

if (process.env.NODE_ENV === 'production') {
	env = require('./config/production.js')
}

module.exports = {
	/*
	** Headers of the page
	*/
	head: {
		title: 'Tube',
		meta: [
			{charset: 'utf-8'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{hid: 'description', name: 'description', content: 'Tube client frontend '}
		],
		link: [
			{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
		]
	},
	/*
	** CSS File
	*/
	css: [],
	/*
	** Env File
	*/
	env: env,
	/*
	** Plugins
	*/
	plugins: [
		{
			src: '~/plugins/localforage.js',
			ssr: false
		},
		'~/plugins/authenticationGuard.js',
		'~/plugins/vuetify.js'
	],
	/*
	** Customize the progress bar color
	*/
	loading: {color: '#3B8070'},
	/*
	** Router
	*/
	router: {
		middleware: 'authenticationGuard',
	},
	/*
	** Build configuration
	*/

	build: {
		/*
		** Run ESLint on save
		*/
		extend(config, {isDev, isClient}) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
		},
		/*
		** Configure Postcss
		*/
		postcss: [
			require('autoprefixer'),
		],

		vendor: [
			'axios',
			'localforage',
			'vuetify'
		]
	}
}
