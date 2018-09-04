<template>
	<v-layout row>

		<v-flex xs12 sm6 offset-sm3>
			<h1>Payment Information</h1>
			<p class="text-red">{{error}}</p>

			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam amet consequatur delectus deleniti eaque eligendi explicabo in ipsa ipsam ipsum itaque neque optio ratione reprehenderit similique totam, velit voluptates.</p>
			<v-btn color="primary" @click="openStripe()">Add Credit Card</v-btn><v-btn color="primary" href="/home">I'll Do it later</v-btn>
			<script src="https://checkout.stripe.com/checkout.js"></script>
		</v-flex>
	</v-layout>
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

					// @todo move key to env or API altogether?
					this.handler = StripeCheckout.configure({
						key: 'pk_test_9r6Oor4LczyFiSjWox5B64y7',
						image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
						locale: 'auto',
						panelLabel: 'Add Credit Card',
						token: function (token) {
							this.error = ''
							_this.$axios.$post('/auth/register/client', {
								token: token.id
							}).then((res) => {
								_this.paymentAccepted = true;
								_this.$router.push('/home');
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
					name: 'Tube Research',
					description: 'Use CC# 4242 4242 4242 4242',
					email: this.$auth.user.email
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