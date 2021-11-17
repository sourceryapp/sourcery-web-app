// authUser props:  { uid, displayName, photoURL, email, emailVerified, phoneNumber }
const initialState = () => {
    return {
        archiveOrigin: false,
        archiveInfo: {}
    }
}

export const state = initialState

export const getters = {
    fromArchiveSpace: (state, getters) => (state.archiveOrigin === true)
}

export const mutations = {
    reset (state) {
        const s = initialState()
        Object.keys(s).forEach((key) => {
            state[key] = s[key]
        })
    },
    setArchiveOrigin (state, val) {
        state.archiveOrigin = val
    },
    setArchiveInfo (state, obj) {
        state.archiveInfo = obj
    }
}
