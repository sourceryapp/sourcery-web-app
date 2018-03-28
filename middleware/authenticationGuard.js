import axios from 'axios'

export default ({store, redirect, route}) => {
	if (!process.server && store.state.auth.token !== null) {
		console.log('middleware')
		return axios.patch(process.env.API_URL + 'auth/refresh').then((res) => {
			store.dispatch('auth/setToken', {token: res.data.data.token}).then(() => {
				return Promise.resolve()
			})
		}).then(() => {
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
}