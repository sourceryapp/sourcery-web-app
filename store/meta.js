import { Utils } from "~/modules/utilities"
import { get } from "https"

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
        requestUpdates: null
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
     * Check to see if this store has been populated.
     */
    isset: (state, getters) => (typeof state.stripe.access_token !== 'undefined')
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
    balance(state, obj){
        state.balance = obj
    },
    reset(state) {
        const s = initialState()
        Object.keys(s).forEach(key => {
            state[key] = s[key]
        })
    }
}

export const actions = {

}
