<template>
	<div>
		<h1>Home</h1>
		<h2>Requests</h2>
		<h3>Pending</h3>
		<ul v-if="user">
			<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'pending'">
				<nuxt-link :to="{name: 'request-id', params: {id: request.id}}">{{request.label}}</nuxt-link>
			</li>
			<li v-else><em>No Pending Requests</em></li>
		</ul>
		<h3>Picked Up</h3>
		<ul v-if="user">
			<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'picked_up'">
				{{request.label}}
			</li>
			<li v-else><em>No Picked Up Requests</em></li>
		</ul>
		<h3>Completed</h3>
		<ul v-if="user">
			<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'completed'">
				{{request.label}}
			</li>
			<li v-else><em>No Completed Requests</em></li>
		</ul>
		<h3>History</h3>
		<ul>
			<li v-for="(request, index) in user.client_requests" :key="index">
				{{request.label}}
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "home",
		computed: {
			user() {
				return this.$store.state.auth.user
			}
		}
	}
</script>

<style scoped>

</style>