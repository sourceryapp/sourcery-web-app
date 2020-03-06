import { Utils } from "~/modules/utilities"

/**
 * Fetches user-meta and populates the Vuex store
 */
export default async function ({ store, $axios, redirect, route, error }) {
    console.group('User Meta Middleware - /middleware/user-meta.js');

    console.info('User as reported by Vuex Store:', store.getters['auth/activeUser']);

    /**
     * Only try to fetch meta data if user is authenticated
     * and the meta data hasn't been populated yet.
     */
    console.info('Do we have stripe meta data in the Vuex store?:', store.getters['meta/isset'] ? 'yes' : 'no');
    if (store.state.auth.user && !(store.getters['meta/isset'])){

        // Gets usermeta from the database
        let usermeta = await Utils.getUserMeta( store.getters['auth/activeUser'].uid );

        // Merges the fetched data with the default state to ensure that
        // none of the usermeta properties are undefined
        usermeta = Object.assign(JSON.parse(JSON.stringify(store.state.meta)), usermeta);

        console.info("Meta retrieved:", usermeta)
        store.commit('meta/setStripe', usermeta.stripe)
        store.commit('meta/setPhone', usermeta.phone)
        store.commit('meta/setAgent', usermeta.agentUpdates)
        store.commit('meta/setNews', usermeta.newsUpdates)
        store.commit('meta/setRequest', usermeta.requestUpdates)
        store.commit('meta/setSourcerer', usermeta.sourcerer)
        store.commit('meta/setResearcher', usermeta.researcher)
        store.commit('meta/setOnboardingComplete', usermeta.onboardingComplete)
        store.commit('meta/setStripeCustomerId', usermeta.stripeCustomerId)
        console.log('Meta Store', store.state.meta);
        if(usermeta && usermeta.stripe && usermeta.stripe.stripe_user_id){
            try{
                let { data } = await $axios.get('balance',{
                    params: {
                        acct: usermeta.stripe.stripe_user_id
                    }
                });
                store.commit('meta/balance', data);
            }catch(err){
                console.error(err);
            }
        }
    }else {
        console.info('No need to fetch new user meta')
    }
    console.groupEnd();


}
