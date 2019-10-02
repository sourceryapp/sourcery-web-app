import { Utils } from "~/modules/utilities.js"

/**
 * This middleware checks whether the user has connected to
 * Stripe and has a stripe user id. If not, we redirect to the
 * account payment page.
 */
export default async function ({ store, redirect, route, error, req }) {

    let routeName = 'account-payment';
    let paymentRoute = '/account/payment';

    console.group('Stripe Middleware - /middleware/stripe-check.js');
    if (store.getters['auth/activeUser'] && (route.name !== routeName) && !(store.getters['meta/isset']) ){
        console.info("User has not connected to stripe. Redirecting.")
        return redirect(paymentRoute)
    }else{
        console.info("User has already connected to Stripe")
    }
    console.groupEnd();

}
