import { Utils } from "~/modules/utilities.js"

/**
 * This middleware checks whether the user has connected to
 * Stripe and has a stripe user id. If not, we redirect to the
 * account payment page.
 */
export default async function ({ store, redirect, route, error, req }) {

    let paymentRoute = '/account/payment';

    if (store.getters.activeUser && route.path !== paymentRoute){
        console.info('Stripe Middleware Running');

        let { stripe } = await Utils.getUserMeta(store.getters.activeUser.uid);

        if(!stripe.stripe_user_id){
            console.warn("User has not connected to stripe")
            return redirect(paymentRoute)
        }

    }

}
