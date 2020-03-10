import { Utils } from "~/modules/utilities"
import firebase from 'firebase/app'
import { db } from "~/plugins/firebase-client-init.js";

/**
 * Any properties for the meta state should be added
 * to this function.
 * Example: @url https://tahazsh.com/vuebyte-reset-module-state
 */
const initialState = () => {
    return {
        stripe: {},
        balance: {},
        phone: null,
        agentUpdates: null,
        newsUpdates: null,
        requestUpdates: null,
        location: null,
        onboardingComplete: false,
        researcher: false,
        sourcerer: false,
        stripeCustomerId: false,
        cards: false,
    }
}

/**
 * The initial state uses the initialState() function
 */
export const state = initialState;


/**
 * Getters for our metadata
 */
export const getters = {
    balance: (state, getters) =>  {
        if(state.balance && state.balance.available){
            return Utils.currencyFormat(state.balance.available[0].amount, state.balance.available[0].currency)
        }
    },
    /**
     * Check to see if Stripe Connect has been linked
     */
    isset: (state, getters) => ((typeof state.stripe.access_token) !== 'undefined'),

    /**
     * Is this user a sourcerer?
     */
    isSourcerer: (state, getters) => (state.sourcerer === true),

    /**
     * Is this user a researcher?
     */
    isResearcher: (state, getters) => (state.researcher === true),

    /**
     * Can the user receive payments?
     */
    canReceivePayments: (state, getters) => (typeof state.stripe.access_token !== 'undefined'),

    /**
     * Can the user make payments?
     */
    canMakePayments: (state, getters) => (state.stripeCustomerId !== null && state.stripeCustomerId !== false),

    /**
     * Has the user completed onboarding?
     */
    onboardingComplete: (state, getters) => (state.onboardingComplete !== null && state.onboardingComplete !== false),
}


export const mutations = {
    /* this method is not good and needs to go at some point */
    set(state, obj){
        state = Object.assign(state, obj);
    },
    setStripe(state, obj={}) {
        console.info('New Stripe data being stored to Vuex:', obj)
        state.stripe = obj;
    },
    setPhone(state, obj=null){
        state.phone = obj;
    },
    setAgent(state, obj=null) {
        state.agentUpdates = obj;
    },
    setNews(state, obj=null) {
        state.newsUpdates = obj;
    },
    setRequest(state, obj=null) {
        state.requestUpdates = obj;
    },
    setLocation(state, obj=null){
        state.location = new firebase.firestore.GeoPoint(obj.latitude, obj.longitude);
    },
    setSourcerer(state, val){
        state.sourcerer = val;
    },
    setResearcher(state, val) {
        state.researcher = val;
    },
    balance(state, obj){
        state.balance = obj
    },
    setOnboardingComplete(state, val){
        state.onboardingComplete = val;
    },
    setStripeCustomerId(state, id){
        state.stripeCustomerId = id;
    },
    reset(state) {
        const s = initialState()
        Object.keys(s).forEach(key => {
            state[key] = s[key]
        })
    }
}


/**
 * Available properties within actions
{
  state,      // same as `store.state`, or local state if in modules
  rootState,  // same as `store.state`, only in modules
  commit,     // same as `store.commit`
  dispatch,   // same as `store.dispatch`
  getters,    // same as `store.getters`, or local getters if in modules
  rootGetters // same as `store.getters`, only in modules
}
 */
export const actions = {
    async save({state, rootGetters}, key){
        return await db.collection('user-meta').doc(rootGetters['auth/activeUser'].uid).set({
            [key]: state[key]
        }, { merge: true });
    },
    /**
     * Updates the current user location
     */
    updateCurrentLocation({state, commit, dispatch}){
        navigator.geolocation.getCurrentPosition( ({coords}) => {
            commit('setLocation', coords)
            dispatch('save', 'location');
        }, () => {
            // Failed - User won't give access
            console.info('Geolocation failed in meta.js')
        });
    }
}

export const subscribe = (mutation, state) => {
    console.log(mutation, state)
}
