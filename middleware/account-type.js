/**
 * Determines whether this user has configured an account type
 */
// [ONBOARD]export default async function ({ store, $axios, redirect, route, error }) {
// [ONBOARD]   const routeName = 'register-account-type'

/**
     * If this an existing stripe-connect user, we will completely
     * by-pass the onboarding pages.
     */
// [ONBOARD]  if (store.getters['meta/canReceivePayments'] && !store.getters['meta/onboardingComplete']) {
// [ONBOARD]      console.warn('Existing user that is a researcher')

// Set onboarding complete and log as researcher
// [ONBOARD]     store.commit('meta/setOnboardingComplete', true)
// [ONBOARD]     store.commit('meta/setResearcher', true)

// Save the status
// [ONBOARD]     await store.dispatch('meta/save', 'onboardingComplete')
// [ONBOARD]     await store.dispatch('meta/save', 'researcher')
// [ONBOARD]}

/**
     * Has the user chosen to be a Sourcerer or Researcher?
     */

// [ONBOARD]console.log('Is a sourcerer?', !store.getters['meta/isSourcerer'])
// [ONBOARD]console.log('Is a researcher?', !store.getters['meta/isResearcher'])
// [ONBOARD]console.log('Route Name', route.name, routeName)
// [ONBOARD]console.log('Authenticated?', store.getters['auth/activeUser'])

// [ONBOARD]console.log('If statement', (store.getters['auth/activeUser'] && (route.name !== routeName) && !(store.getters['meta/isSourcerer']) && !(store.getters['meta/isResearcher'])))
// [ONBOARD]if (store.getters['auth/activeUser'] && (route.name !== routeName) && !(store.getters['meta/isSourcerer']) && !(store.getters['meta/isResearcher'])) {
/**
         * If:
         * - User is authenticated &
         * - Route requested is not register-account-type &
         * - User is not a Sourcerer &
         * - User is not a Researcher
         */
// [ONBOARD]return redirect({ name: routeName })
// [ONBOARD]}
// [ONBOARD]}
