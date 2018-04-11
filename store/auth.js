import localForage from 'localforage'
import axios from 'axios'
import {isEmpty} from 'lodash'

export const state = () => ({
	token: '',
	user: {}
})

export const mutations = {
	setToken(state, token) {
		state.token = token
	},
	setUser(state, user) {
		state.user = user
	}
}

export const actions = {
	setToken({commit}, {token}) {
		console.log('setToken action')
		if (isEmpty(token)) {
			return Promise.reject('TOKEN TO BE SET IS NULL')
		} else {
			return localForage.setItem('authtoken', token).then(() => {
				axios.defaults.headers.common['Authorization'] = "Bearer " + token;
				commit('setToken', token)
			}).catch((err) => {
				console.log(err)
			})
		}
	},
	clearToken({commit}) {
		console.log('clearToken')
		return localForage.setItem('authtoken', null).then(() => {
			axios.defaults.headers.common['Authorization'] = ''
			commit('setToken', null)
		}).catch((err) => {
			console.log(err)
		})
	},
	login({commit, dispatch}, {token}) {
		console.log('login')
		return dispatch('setToken', {token: token}).then(() => {
			console.log('set the token from login')
			return axios.get(process.env.API_URL + 'auth/user').then((res) => {
				commit('setUser', res.data.data)
				return Promise.resolve()
			})
		}).then((user) => {
			return Promise.resolve(user)
		})
	},
	logout({commit, dispatch}) {
		return axios.delete(process.env.API_URL + 'auth/invalidate').then(() => {
			dispatch('setToken', {token: null}).then(() => {
				commit('setUser', null)
			})
		}).catch(() => {
			dispatch('setToken', {token: null}).then(() => {
				commit('setUser', null)
			})
		})
	},
	setUser({commit}) {
		return axios.get(process.env.API_URL + 'auth/user').then((res) => {
			commit('setUser', res.data.data)
			return Promise.resolve()
		})
	}
}
