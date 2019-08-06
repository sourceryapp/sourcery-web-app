import { Utils } from "~/modules/utilities.js"

/**
 * This middleware checks whether the user has connected to
 * Stripe and has a stripe user id. If not, we redirect to the
 * account payment page.
 */
export default async function ({ store, redirect, route, error, req }) {

    let routeName = 'account-payment';
    let paymentRoute = '/account/payment';


    if (store.getters.activeUser && (route.name !== routeName)){
        console.info('Stripe Middleware Running');

        try {
            let meta = await Utils.getUserMeta(store.getters.activeUser.uid);
            if (!(meta && meta.stripe)) {
                console.warn("User has not connected to stripe")
                return redirect(paymentRoute)
            }
        } catch (error) {
            console.error(error);
        }
    }

}
