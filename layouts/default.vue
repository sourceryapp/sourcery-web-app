<template>
	<v-app id="tube">
		<v-toolbar color="white" light fixed app>
			<v-layout row wrap justify-space-between>
				<v-flex text-xs-center>
					<v-toolbar-title><nuxt-link to="/"><img src="/img/logo.svg" id="logo"></nuxt-link></v-toolbar-title>
				</v-flex>
			</v-layout>

		</v-toolbar>
		<v-content pa-0>
			<v-container fluid fill-height pa-0>
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
            v-if="this.$auth.user"
            color="white"
        >
            <v-btn
                flat
                value="user"
                color="primary"
                to="/account"
                v-if="this.$route.path!='/account'"
            >
                <span>Account</span>
                <v-icon>person</v-icon>
            </v-btn>

            <v-btn
                flat
                value="dashboard"
                color="primary"
                to="/"
                v-if="this.$route.path=='/account'"
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

    </v-app>
</template>

<script>

	export default {
		computed: {

		},
		methods: {

		},
        data: () => ({
            drawer: null,

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

	/* #tube {
		background-image: url("/img/top-left-graphic.png"), url("/img/bottom-right-graphic.png");
		background-position: top left, bottom right;
        background-repeat: no-repeat;
	} */

	.teal {
		background-color: #4DADA9;
	}
</style>
