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

					<v-list two-line>
                            <v-subheader>
                                Requests
                            </v-subheader>
                            <v-divider></v-divider>

                            <template v-for="(request, index) in requests" v-if="request.status !== 'completed'">

                            <v-list-tile :key="index">
                                <v-list-tile-content >
                                    <v-list-tile-title>{{ request.label }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ request.citation }} {{request.status}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider :key="index"></v-divider>
                            </template>
					</v-list>
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
                requests: null
			}
		},
        mounted(){
            this.$axios
                .$get('/requests')
                .then(response => (this.requests = response.data));
        }
	}
</script>

<style scoped>

</style>
