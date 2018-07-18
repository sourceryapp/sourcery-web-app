<template>

		<!--<nuxt-link :to="{name:'request-create'}">Create Request</nuxt-link>-->
		<!--<h3>Pending</h3>-->
		<!--<div v-if="user !== null">-->
			<!--<ul>-->
				<!--<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'pending'">-->
					<!--<nuxt-link :to="{name: 'request-id', params: {id: request.id}}">{{request.label}}</nuxt-link>-->
				<!--</li>-->
			<!--</ul>-->
		<!--</div>-->
		<!--<h3>Picked Up</h3>-->
		<!--<div v-if="user !== null">-->
			<!--<ul>-->
				<!--<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'picked_up'">-->
					<!--<nuxt-link :to="{name: 'request-id', params: {id: request.id}}">{{request.label}}</nuxt-link>-->
				<!--</li>-->
			<!--</ul>-->
		<!--</div>-->
		<!--<h3>Completed</h3>-->
		<!--<div v-if="user !== null">-->
			<!--<ul>-->
				<!--<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'completed'">-->
					<!--<nuxt-link :to="{name: 'request-id', params: {id: request.id}}">{{request.label}}</nuxt-link>-->
				<!--</li>-->
			<!--</ul>-->
		<!--</div>-->
		<!--<h3>History</h3>-->
		<!--<ul>-->
			<!--<li v-for="(request, index) in user.client_requests" :key="index">-->
				<!--{{request.label}}-->
			<!--</li>-->
		<!--</ul>-->


		<v-layout row>

			<v-flex xs12 sm6 offset-sm3>
                <h1>Dashboard</h1>
                <h3>Requests</h3>
				<v-card>

					<v-list two-line>
						<template>
							<v-subheader>
								Pending
							</v-subheader>

							<v-divider></v-divider>

							<v-list-tile  v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'pending'" >
								<v-list-tile-action>
                                    <v-icon>send</v-icon>
								</v-list-tile-action>

								<v-list-tile-content >
                                    <v-list-tile-title>{{ request.label }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ request.citation }}</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>

                            <v-subheader>
                                Picked Up
                            </v-subheader>

                            <v-divider></v-divider>

                            <v-list-tile  v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'picked_up'">
                                <v-list-tile-action>
                                    <v-icon>alarm</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content >
                                    <v-list-tile-title>{{ request.label }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ request.citation }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-subheader>
                                Completed
                            </v-subheader>

                            <v-divider></v-divider>

                            <v-list-tile  v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'completed'">
                                <v-list-tile-action>
                                    <v-icon>done</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content >
                                    <v-list-tile-title>{{ request.label }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ request.citation }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
						</template>
					</v-list>
				</v-card>
			</v-flex>
		</v-layout>

</template>

<script>
	export default {
		name: "home",
		computed: {
			user() {
				return this.$store.state.auth.user
			}
		},
		data: function(){
		    return {

			}
		}
	}
</script>

<style scoped>

</style>