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
            {hid: 'description', name: 'description', content: 'Tube is a way for scholars around the world to assist each other in the acquisition of non-digitized documents.'},
            {"http-equiv": "x-ua-compatible", content: "ie=edge" },
            {"name": "apple-mobile-web-app-title", "content": "Tube"},
            {"name": "application-name","content": "Tube"},
            {"name": "msapplication-TileColor", "content": "#da532c"},
            {"name": "theme-color","content": "#ffffff"}
		],
		link: [
			{rel: 'icon', type: 'image/x-icon', href: '/img/icons/favicon.ico'},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
            {"rel": "apple-touch-icon","sizes": "180x180","href": "/img/apple-touch-icon.png"},
            {"rel": "icon","type": "image/png","sizes": "32x32","href": "/img/icons/favicon-32x32.png"},
            {"rel": "icon","type": "image/png","sizes": "16x16","href": "/img/icons/favicon-16x16.png"},
            {"rel": "manifest","href": "/manifest.json"},
            {"rel": "mask-icon","href": "/img/icons/safari-pinned-tab.svg","color": "#5bbad5"}
        ]
	},
	/*
	** CSS File
	*/
	css: [
	    '~assets/styles/app.styl'
    ],
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


		vendor: [
			'axios',
			'localforage',
            '~/plugins/vuetify.js'
		],
        extractCSS: true,
	}
}
