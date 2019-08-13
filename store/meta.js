import { Utils } from "~/modules/utilities"
export const state = () => ({
    stripe: {},
    balance: {},
    phone: null
})

export const getters = {
    balance: (state, getters) =>  Utils.currencyFormat(state.balance.available[0].amount, state.balance.available[0].currency)
}

export const mutations = {
    set(state, obj){
        state = Object.assign(state, obj);
    },
    balance(state, obj){
        state.balance = obj
    }
}

export const actions = {

}
