import cookieParser from 'cookieparser'
import jwt_decode from 'jwt-decode'
import { formatMoney, unformat } from 'accounting-js'

export default ({ app }, inject) => {
    const utils = (() => {
        return {
            /**
             * Get First Name
             * Assumes str is a full name
             * "Brian Daley" would return "Brian"
             */
            getFirstName: str => str.split(' ').slice(0, -1).join(' '),

            /**
             * Get Last Name
             * Assumes str is a full name
             * "Brian Daley" would return "Daley"
             */
            getLastName: str => str.split(' ').slice(-1).join(' '),

            /**
             * Uppercase First Letters
             * Assumes str is a string, with words divided by spaces
             * "picked up" would return "Picked Up"
             */
            uppercaseFirstLetters: (str) => {
                const s = str.split(' ')
                for (let i = 0; i < s.length; i++) {
                    s[i] = s[i][0].toUpperCase() + s[i].substr(1)
                }
                return s.join(' ')
            },

            /**
             * Builds a query string from an object of parameters
             */
            buildQueryString: params =>
                Object.keys(params)
                    .map(key => key + '=' + encodeURIComponent(params[key]))
                    .join('&'),

            getUserFromCookie: (cookie) => {
                const parsed = cookieParser.parse(cookie)

                if (parsed.token) {
                    const { name, picture, user_id, email } = jwt_decode(
                        parsed.token
                    )

                    return {
                        email,
                        uid: user_id,
                        displayName: name,
                        photoURL: picture
                    }
                }
            },

            addressToEncodedString: (repository) => {
                return repository.address1.concat(
                    repository.address2
                        ? `,${encodeURIComponent(repository.address2)}`
                        : '',
                    `,${encodeURIComponent(repository.city)}`,
                    `,${encodeURIComponent(repository.state)}`
                )
            },

            /**
             * Gets UserMeta for chosen UID
             */
            getUserMeta: async (uid) => {
                const doc = await app.$fire.firestore
                    .collection('user-meta')
                    .doc(uid)
                    .get()
                return Promise.resolve(doc.data())
            },

            /**
             * Returns true if the current authenticated user has a password.
             * @returns Boolean
             */
            getCurrentUserHasPassword: async (authUser = {}) => {
                let currentUser = authUser
                if (!authUser) {
                    console.log('no authuser')
                    currentUser = app.$fire.auth.currentUser
                }
                if (currentUser) {
                    try {
                        const methods = await app.$fire.auth.fetchSignInMethodsForEmail(currentUser.email)
                        if (methods.includes(app.$fireModule.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)) {
                            // Has a password.
                            return true
                        }
                        if (methods.includes(app.$fireModule.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)) {
                            // Has passwordless login.
                            return false
                        }
                    } catch (error) {
                        console.log(error)
                        return false
                    }
                }
                // Assume by default there is not a password, especially if no user.
                return false
            },

            /**
             * Simple Currency Formatter
             * Assumes USD
             */
            currencyFormat: (cents, curr = 'USD') => {
                console.log(__filename, cents)
                const currency = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: curr
                })
                return currency.format(cents / 100)
            },

            /**
             * Estimate the final cost of a job.
             * Actual cost will vary slightly based on various factors.
             *
             * @todo move to a maintained lib like Dinero (https://github.com/sarahdayan/dinero.js)
             */
            estimatedCost: ({ pages }, prefix = '$') => {
                return formatMoney(30 + pages * 0.5 + Math.random(), prefix)
            },

            /**
             * Get the value of a job for a Sourcerer
             */
            jobValue (job, prefix = '$') {
                // User gets 80% of cost.
                return job.pricing && job.pricing !== null
                    ? this.currencyFormat(job.pricing.total * 0.8)
                    : formatMoney(unformat(job.estimated_cost_usd) * 0.8)
            },

            socialLinks: {
                twitter: 'https://twitter.com/sourcery_app',
                facebook: 'https://www.facebook.com/SourceryApp',
                instagram: 'https://www.instagram.com/sourcery_app/'
            }
        }
    })()

    // Inject $utils() in Vue, context and store.
    inject('utils', utils)
}