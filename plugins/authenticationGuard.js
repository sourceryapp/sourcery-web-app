import localForage from "localforage";
import axios from 'axios'
import {isEmpty} from 'lodash'

export default (({route, redirect, store}) => {
	console.log('plugin')
	localForage.getItem('authtoken').then(token => {
		console.log('setting token from plugin')
		return store.dispatch('auth/setToken', {token: token}).then(() => {
			console.log('set the token from plugin')
			console.log('refreshed the token from the plugin')
			return store.dispatch('auth/login', {token: token}).then(() => {
				console.log('logged in from the plugin')
				if (['login', 'register', 'index'].includes(route.name)) {
					redirect('/home')
				}
				const user = store.state.auth.user
				if (user.client == false && user.vendor == false && !['register-type', 'register-client', 'register-vendor'].includes(route.name)) {
					redirect('/register/type')
				}
				if (route.name == 'register-type') {
					if (user.client && user.vendor) {
						redirect('/home')
					}

					if (user.client) {
						redirect('/register/vendor')
					}

					if (user.vendor) {
						redirect('/register/client')
					}
				}
			})
		}).catch((err) => {
			console.log('setToken Error from plugin: ', err)
			store.dispatch('auth/clearToken').then(() => {
				if (!['login', 'register', 'index'].includes(route.name)) {
					redirect('/login')
				}
			})
		})
	})
})