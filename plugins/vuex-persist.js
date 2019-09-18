/**
 * vuex-persist
 * @description A Vuex plugin to persist the store.
 * @url https://github.com/championswimmer/vuex-persist
 */
import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
    new VuexPersistence({
        /* your options */
    }).plugin(store);
}
