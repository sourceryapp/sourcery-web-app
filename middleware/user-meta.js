import { Utils } from "~/modules/utilities"

/**
 * Fetches user-meta and populates the Vuex store
 */
export default async function ({ store, $axios, redirect, route, error }) {
    console.info('User Meta Middleware Running', 'User', store.getters['auth/activeUser']);

    if(store.state.auth.user){
        let usermeta = await Utils.getUserMeta( store.getters['auth/activeUser'].uid );
        store.commit('meta/set', usermeta)
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
    }

}
