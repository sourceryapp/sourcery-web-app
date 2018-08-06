<template>
	<div>
		<h1>Registration</h1>
		<v-subheader>Payment Information</v-subheader>
		<v-btn color="primary" @click.prevent="openStripe" v-if="!paymentAccepted">Enter Credit Card Information</v-btn>
		<nuxt-link :to="{name: 'home'}" v-else>Finish</nuxt-link>
		<p class="text-red">{{error}}</p>
		<script src="https://checkout.stripe.com/checkout.js"


		></script>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "client",
		data() {
			return {
				handler: null,
				error: '',
				paymentAccepted: false,
			}
		},
		methods: {
			openStripe() {
				if (!this.handler) {
					let _this = this
					this.handler = StripeCheckout.configure({
						key: 'pk_test_9r6Oor4LczyFiSjWox5B64y7',
						image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
						locale: 'auto',
						panelLabel: 'Add Credit Card',
						token: function (token) {
							console.log(token.id)
							this.error = ''

							axios.post(process.env.API_URL + 'auth/register/client', {
								token: token.id
							}).then((res) => {
								_this.paymentAccepted = true
								console.log(res)
							}).catch((err) => {
								console.log(err)
								console.log(err.response)
								this.error = "something went wrong, please try again"
							})
						}
					});
				}

				this.handler.open({
					name: 'Tube',
					description: '2 widgets',
				});
			}
		},
		mounted() {
			if (process.browser) {

				window.addEventListener('popstate', function () {
					this.handler.close();
				});
			}
		}
	}
</script>

<style scoped>

</style>