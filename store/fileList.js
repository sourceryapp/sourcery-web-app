/**
 * A simple store to manage the state of the
 * FileList object across multiple file-* components
 */
const initialState = () => {
    return {
        files: []
    }
}

export const state = initialState

export const getters = {
    // func (state) {
    //     return state.sometin
    // }
}

export const mutations = {
    add (state, file) {
        state.files.push(file)
    },
    remove (state, index) {
        state.files.splice(index, 1)
    },
    reset (state) {
        state = initialState
    }
}

export const actions = {
    addAll ({ commit }, fileList) {
        for (const f of fileList) {
            commit('add', f)
        }
    }
    // async tbd ({ state, commit, dispatch, rootGetters }) {

    // }
}
