import { Utils } from "~/modules/utilities"

/**
 * Determines whether this user has configured an account type
 */
export default async function ({ store, $axios, redirect, route, error }) {


    let routeName = 'register-account-type';

    /**
     * If this an existing stripe-connect user, we will completely
     * by-pass the onboarding pages.
     */
    if(store.getters['meta/canReceivePayments'] && !store.getters['meta/onboardingComplete']){

        console.warn("Existing user that is a researcher");

        // Set onboarding complete and log as researcher
        store.commit('meta/setOnboardingComplete', true);
        store.commit('meta/setResearcher', true);

        // Save the status
        await store.dispatch('meta/save', 'onboardingComplete');
        await store.dispatch('meta/save', 'researcher');

    }

    /**
     * Has the user chosen to be a Sourcerer or Researcher?
     */

     console.log("Is a sourcerer?", !store.getters['meta/isSourcerer']);
     console.log("Is a researcher?", !store.getters['meta/isResearcher']);
     console.log("Route Name", route.name, routeName);
     console.log("Authenticated?", store.getters['auth/activeUser']);

    console.log("If statement", (store.getters['auth/activeUser'] && (route.name !== routeName) && !(store.getters['meta/isSourcerer']) && !(store.getters['meta/isResearcher']) ))
    if (store.getters['auth/activeUser'] && (route.name !== routeName) && !(store.getters['meta/isSourcerer']) && !(store.getters['meta/isResearcher']) ) {

        /**
         * If:
         * - User is authenticated &
         * - Route requested is not register-account-type &
         * - User is not a Sourcerer &
         * - User is not a Researcher
         */
        return redirect({ name: routeName });
    }

}
