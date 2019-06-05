<template>
	<v-app id="tube">
        <v-navigation-drawer
        class="primary"
        v-model="drawer"
        dark
        left
        app
        v-if="user"
        >
            <v-list class="pa-0">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img v-bind:src="gravatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content v-if="this.user">
                        <v-list-tile-title>{{this.user.displayName}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{this.user.email}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>

            <v-divider></v-divider>

            <v-list dense class="pt-0" two-line>
                <v-list-tile
                    v-for="item in items1"
                    :key="item.title"
                    :to = "item.link"
                >
                    <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>

            <v-list dense class="pt-0" two-line>
                <v-list-tile
                    v-for="item in items2"
                    :key="item.title"
                    :to = "item.link"
                >
                    <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="dialog=true" nuxt active-class>
                    <v-list-tile-action>
                        <v-icon>power_settings_new</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Log Out</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>



        </v-navigation-drawer>
		<v-toolbar color="white" light fixed app>

            <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="user"></v-toolbar-side-icon>

            <v-toolbar-title style="display:flex; justify-content:center; width: 100%" class="ma-0">

                <nuxt-link to="/" id="wordmark-link">
                    <svg id="wordmark" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 665.61 195.21"><defs><style>.cls-1{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{font-size:162.94px;fill:#654fa1;font-family:FiraSans-Heavy, Fira Sans;font-weight:800;}.cls-4{letter-spacing:-0.01em;}.cls-5{letter-spacing:0.05em;}.cls-6{fill:#654ea3;}</style><clipPath id="clip-path" transform="translate(-59.3)"><rect class="cls-1" y="4.24" width="782.26" height="189.19"/></clipPath></defs><title>Asset 2</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g class="cls-2"><text class="cls-3" transform="translate(0.81 138.17)">sou<tspan class="cls-4" x="267.71" y="0">rc</tspan><tspan x="409.63" y="0">e</tspan><tspan class="cls-5" x="500.39" y="0">r</tspan><tspan x="575.34" y="0">y</tspan></text></g><polygon class="cls-6" points="226.29 4.24 222.34 16.79 226.29 29.33 230.45 16.79 226.29 4.24"/><polygon class="cls-6" points="226.4 12.73 213.85 16.68 226.4 20.84 238.94 16.68 226.4 12.73"/><polygon class="cls-6" points="208.09 31.93 211 41.18 214.07 31.93 211 22.68 208.09 31.93"/><polygon class="cls-6" points="211.08 28.94 201.82 31.85 211.08 34.92 220.33 31.85 211.08 28.94"/><polygon class="cls-6" points="228.7 37.66 230.59 43.68 232.59 37.66 230.59 31.65 228.7 37.66"/><polygon class="cls-6" points="230.64 35.72 224.63 37.62 230.64 39.61 236.66 37.62 230.64 35.72"/></g></g></svg>
                </nuxt-link>
            </v-toolbar-title>

            <!-- Stupid Hack to center align the wordmark -->
            <v-toolbar-side-icon style="visibility: hidden" v-if="user"></v-toolbar-side-icon>


		</v-toolbar>
		<v-content pa-0>
			<v-container fill-height>
				<v-layout
						justify-center
				>
					<nuxt/>
				</v-layout>
			</v-container>
		</v-content>
        <v-bottom-nav
            :value="true"
            dark
            app
            fixed
            v-if="user"
            color="white"
        >
            <v-btn
                flat
                value="dashboard"
                color="primary"
                to="/"
            >
                <span>Dashboard</span>
                <v-icon>dashboard</v-icon>
            </v-btn>

            <v-btn
                flat
                value="add"
                color="primary"
                to="/request/create"
            >
                <span>New Request</span>
                <v-icon>add_circle</v-icon>
            </v-btn>

            <v-btn
                flat
                color="primary"
                value="search"
                to="/jobs"
            >
                <span>Find Jobs</span>
                <v-icon>search</v-icon>
            </v-btn>
        </v-bottom-nav>

        <v-dialog
            v-model="dialog"
            max-width="290"
            >
            <v-card>

                <v-card-title class="headline">
                Are you sure you want to log out?
                </v-card-title>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="primary"
                    @click="logout()" nuxt active-class
                >
                    Log Out
                </v-btn>

                <v-btn
                    @click="dialog = false"
                >
                    Cancel
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </v-app>
</template>

<script>
    import md5 from 'md5'

	export default {
		computed: {
            user() {
                return this.$store.getters.activeUser
            },
            gravatar() {
                return `https://www.gravatar.com/avatar/${md5(this.user.email || '')}?d=mp`;
            }
		},
		methods: {
            async logout() {
                await this.$store.dispatch('signOut');
                this.dialog=false;
                this.$router.replace('/login')
            }
		},
        data: () => ({
            drawer: null,
            dialog: false,
            items1: [
                { title: 'Edit Profile', icon: 'person', link: '/account/profile'},
                { title: 'Payment Options', icon: 'credit_card', link: '/account/payment'},
                { title: 'Notifications', icon: 'notifications', link: '/settings/notifications'},
                { title: 'History', icon: 'hourglass_full', link: '/request/history'},
                { title: 'Privacy', icon: 'enhanced_encryption', link: '/settings/privacy'}
            ],
            items2: [
                { title: 'Terms and Conditions', icon: 'subject', link: '/settings/terms_conditions'},
                { title: 'Help', icon: 'help', link: '/account/help'},
                { title: 'Feedback', icon: 'feedback', link: '/settings/feedback'},
                // { title: 'Rate', icon: 'star', link: ''},
            ],
        }),

        props: {
            source: String
        },
        mounted() {
            // console.log('Firebase: ', firebase);
        }
	}
</script>

<style>
    #wordmark-link {
        display: inline-block
    }
	#wordmark {
        display:block;
		width: 200px;
        max-width: 100%;
		height: auto;
	}

	.teal {
		background-color: #4DADA9;
	}
</style>
