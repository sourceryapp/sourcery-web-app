<template>
	<div>
		<h1>Requests</h1>
		<nuxt-link :to="{name:'request-create'}">Create Request</nuxt-link>
		<h3>Pending</h3>
		<div v-if="user !== null">
			<ul>
				<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'pending'">
					<nuxt-link :to="{name: 'request-id', params: {id: request.id}}">{{request.label}}</nuxt-link>
				</li>
			</ul>
		</div>
		<h3>Picked Up</h3>
		<div v-if="user !== null">
			<ul>
				<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'picked_up'">
					<nuxt-link :to="{name: 'request-id', params: {id: request.id}}">{{request.label}}</nuxt-link>
				</li>
			</ul>
		</div>
		<h3>Completed</h3>
		<div v-if="user !== null">
			<ul>
				<li v-for="(request, index) in user.client_requests" :key="index" v-if="request.status === 'completed'">
					<nuxt-link :to="{name: 'request-id', params: {id: request.id}}">{{request.label}}</nuxt-link>
				</li>
			</ul>
		</div>
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