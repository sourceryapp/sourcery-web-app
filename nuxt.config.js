/**
 * Loads environment vars for the current NODE_ENV
 * Options: production, development
 */
import * as env from 'sourcery-env'

/**
 * Don't completely overwrite the
 * existing env vars.
 */
Object.assign(env, process.env)

export default {
    target: 'static',
    ssr: false,

    // @url https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config/
    publicRuntimeConfig: {
        /**
         * Paths that don't require authentication
         */
        publicPaths: [
            '/login',
            '/about',
            '/',
            '/register',
            '/password',
            '/resetpassword',
            '/index-new',
            '/terms',
            '/privacy',
            '/cookies-notice'
        ]
    },

    /*
     ** Headers of the page
     */
    head: {
        title: 'Sourcery',
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ],
        link: [
            {
                rel: 'stylesheet',
                href:
                    'https://fonts.googleapis.com/css?family=Barlow:500,600,700,800&display=swap'
            },
            {
                rel: 'stylesheet',
                href:
                    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
            },
            { rel: 'icon', type: 'image/png', href: '/favicon.png' },
            { rel: 'apple-touch-icon', href: '/apple-icon.png' }
            // {rel: 'stylesheet', type: 'text/css', href: '~/assets/styles/addtohomescreen.css'}
        ],
        script: [
            { src: 'https://js.stripe.com/v3/', async: true },
            { src: '/addtohomescreen.js' }
        ]
    },

    /*
     ** Global CSS Files
     */
    css: [
        '~/assets/styles/sourcery.css',
        // 'material-design-icons-iconfont/dist/material-design-icons.css',
        'paymentfont/css/paymentfont.min.css',
        '~/assets/styles/addtohomescreen.css'
    ],

    /*
     ** Env File
     */
    env,

    /**
     * PWA Icons
     * @url https://pwa.nuxtjs.org/modules/icon.html
     */
    pwa: {
        icon: {
            source: 'static/icon-fz.png'
        }
    },

    /**
     * Meta
     * @todo Add proper meta for FB and Twitter
     * @url https://pwa.nuxtjs.org/modules/meta.html
     */
    meta: {
        name: 'Sourcery',
        description:
            'Sourcery is a way for scholars around the world to assist each other in the acquisition of non-digitized documents.',
        mobileAppIOS: true,
        favicon: false
    },

    /**
     * Workbox
     * @url https://pwa.nuxtjs.org/modules/workbox.html
     */
    workbox: {
        importScripts: [
            // 'firebase-messaging-sw.js'
        ]
    },

    /**
     * PWA Manifest
     * @url https://pwa.nuxtjs.org/modules/manifest.html
     */
    manifest: {
        name: 'Sourcery',
        short_name: 'Sourcery',
        lang: 'en-US',
        orientation: 'portrait',
        start_url: '/dashboard'
    },

    /*
     ** Plugins
     */
    plugins: [
        '~/plugins/vue-instantsearch',

        // Send emails to a specific address
        '~/plugins/feedback',

        // Custom utilities for Sourcery
        '~/plugins/utils',

        // Extensions for the request object
        '~/plugins/request-extensions',

        // Sourcery API
        '~/plugins/sourcery',
        { src: '~/plugins/vuetify.ts', ssr: false }

    ],

    /** pwa: {
        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          swSrc: "~/firebase-messaging-sw.js"
        }
      },**/

    /**
     * Customize the loading bar
     * @url https://nuxtjs.org/api/configuration-loading/
     */
    loading: {
        color: '#654EA3',
        height: '5px'
    },

    /*
     ** Router
     */
    router: {
        middleware: [
            'auth-guard',
            'user-meta',
            'account-type',
            'onboarding-complete'
        ]
    },

    modules: [
        [
            '@nuxtjs/google-analytics',
            {
                id: process.env.GOOGLE_ANALYTICS_ID,
                dev: false // don't use in dev mode
            }
        ],
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        '@nuxtjs/toast',
        '@nuxtjs/firebase',
        '@nuxtjs/sentry'
    ],

    /**
     * Firebase configuration
     * @url https://firebase.nuxtjs.org/guide/getting-started#example-configuration
     */
    firebase: {
        config: env.FIREBASE_CONFIG,
        services: {
            auth: {
                persistence: 'local', // default
                initialize: {
                    onAuthStateChangedMutation: 'auth/SET_AUTH_USER',
                    onAuthStateChangedAction: 'auth/onAuthStateChanged',
                    subscribeManually: false
                },
                ssr: false // default
                // emulatorPort: 9099,
                // emulatorHost: 'http://localhost'
            },
            firestore: true,
            functions: true,
            storage: true,
            remoteConfig: true
        }
    },

    /**
     * Sentry Error Logging
     * @url https://sentry.nuxtjs.org/guide/setup
     */
    sentry: {
        dsn: process.env.SENTRY_DSN
    },

    /**
     * Settings for @nuxtjs/vuetify
     * TODO Upgrade to v2 of Vuetify.
     * @url https://github.com/nuxt-community/vuetify-module/
     */
    vuetify: {
        theme: {
            themes: {
                light: {
                    primary: '#654EA3',
                    secondary: '#4E4B51',
                    accent: '#53AFAC',
                    error: '#b71c1c'
                },
                dark: {
                    primary: '#c5aeef'
                }
            }
        },
        options: {
            customProperties: true
        },
        defaultAssets: {
            font: {
                family: 'Barlow'
            },
            icons: 'mdi'
        },
        treeShake: true,
        customVariables: ['~/assets/variables.scss']
    },

    /**
     * Nuxt Toasted
     * @url https://github.com/nuxt-community/modules/tree/master/packages/toast#toast
     *
     * Options
     * @url https://github.com/shakee93/vue-toasted
     */
    toast: {
        theme: 'toasted-primary', // ['toasted-primary', 'outline', 'bubble']
        position: 'bottom-center',
        duration: 5000,
        keepOnHover: false,
        action: null,
        fullWidth: false,
        fitToScreen: false,
        className: null,
        containerClass: null,
        iconPack: 'material', // ['material', 'fontawesome', 'mdi', 'custom-class', 'callback']
        Icon: null, // Material icon name as string. explained here
        type: 'default', // Type of the Toast ['success', 'info', 'error']
        onComplete: null,
        closeOnSwipe: true,
        singleton: false
    },

    /**
     * Axios
     * @url https://axios.nuxtjs.org/options.html
     */
    axios: {
        baseURL: env.API_URL
    },

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify'
    ],

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        extend (config, { isDev }) {
            // Extend only webpack config for client-bundle
            if (isDev) {
                config.devtool = 'source-map'
            }

            // Fix during development
            config.module.rules.push({
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /(node_modules)/,
                options: {
                    fix: true
                }
            })
        },

        // Disable Console messages in production builds
        terser: {
            terserOptions: {
                compress: {
                    drop_console: true
                }
            }
        }
    }
}
