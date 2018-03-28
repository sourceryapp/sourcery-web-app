import localForage from "localforage";
import axios from 'axios'
import {isEmpty} from 'lodash'

export default (({route, redirect, store}) => {
	const loggedIn = (token) => {
		store.dispatch('auth/login', {token: token}).then(() => {
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
	}
	const loggedOut = () => {
		store.dispatch('auth/setToken', {token: null})
		if (!['login', 'register', 'index'].includes(route.name)) {
			redirect('/login')
		}
	}

	localForage.getItem('authtoken').then(token => {
		if (isEmpty(token)) {
			loggedOut()
		} else {
			store.dispatch('auth/setToken', {token: token}).then(() => {
				axios.patch(process.env.API_URL + 'auth/refresh').then((res) => {
					loggedIn(res.data.data.token)
				}).catch(() => {
					loggedOut()
				})
			})
		}
	})
})