<template>
	<!--<div>-->
		<!--<nav>-->
			<!--<ul>-->
				<!--<li>-->
					<!--<a href="#" @click.prevent="logout">Log Out</a>-->
				<!--</li>-->
				<!--<li>-->
					<!--<nuxt-link :to="{name: 'home'}" v-if="user">Home</nuxt-link>-->
				<!--</li>-->
				<!--<li>-->
					<!--<nuxt-link :to="{name: 'vendor'}" v-if="user && user.vendor == true">Vendor Area</nuxt-link>-->
					<!--<nuxt-link :to="{name: 'register-vendor'}" v-else>Become a Vendor</nuxt-link>-->
				<!--</li>-->
			<!--</ul>-->
		<!--</nav>-->
		<!--<nuxt/>-->
	<!--</div>-->

	<v-app id="tube">
		<v-navigation-drawer
				v-model="drawer"
				fixed
				app
				class="primary"
				dark
                v-if="user"
		>
			<v-toolbar flat class="transparent">
				<v-list class="pa-0">
					<v-list-tile avatar>
						<v-list-tile-avatar>
							<img src="https://randomuser.me/api/portraits/men/85.jpg">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>John Smith</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-toolbar>
			<v-divider></v-divider>
			<v-list dense>

				<v-list-tile href="/#/about">
					<v-list-tile-action>
						<v-icon>contact_mail</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>My Profile</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile href="/#/about">
					<v-list-tile-action>
						<v-icon>credit_card</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Payment Options</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile href="/#/about">
					<v-list-tile-action>
						<v-icon>help</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Help</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile href="/#/about">
					<v-list-tile-action>
						<v-icon>settings</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Settings</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

			</v-list>
		</v-navigation-drawer>
		<v-toolbar color="white" light fixed app>
			<v-layout row wrap justify-space-between>
				<v-flex text-xs-left>
					<v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="user"></v-toolbar-side-icon>
				</v-flex>
				<v-flex text-xs-center>
					<v-toolbar-title><a href="/#/"><img src="/img/logo.svg" id="logo"></a></v-toolbar-title>

				</v-flex>
				<v-flex text-xs-right>
					<v-btn fab dark small color="primary" href="/request/create" v-if="user">
						<v-icon dark>add</v-icon>
					</v-btn>
				</v-flex>
			</v-layout>

		</v-toolbar>
		<v-content>
			<v-container fluid fill-height>
				<v-layout
						justify-center
						align-center
				>
					<nuxt/>
				</v-layout>
			</v-container>
		</v-content>
		<!--<v-footer color="teal" app>-->
		<!--<span class="white&#45;&#45;text">&copy; 2017</span>-->
		<!--</v-footer>-->
	</v-app>
</template>

<script>

	export default {
		components: {
			// ...grid
		},
		computed: {
			user() {
				return this.$store.state.auth.user
			}
		},
		methods: {
			logout() {
				this.$store.dispatch('auth/logout').then(() => {
					this.$router.push({name: 'login'})
				})
			}
		},
        data: () => ({
            drawer: null
        }),

        props: {
            source: String
        }
	}
</script>

<style>
	#logo {
		width: 100px;
		height: auto;
	}

	main .container {
		background-image: url("/img/top-left-graphic.png"), url("/img/bottom-right-graphic.png");
		background-position: top left, bottom right;
	}

	.teal {
		background-color: #4DADA9;
	}
</style>
