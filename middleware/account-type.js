import { Utils } from "~/modules/utilities"

/**
 * Determines whether this user has configured an account type
 */
export default async function ({ store, $axios, redirect, route, error }) {


    let routeName = 'register-account-type';

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
