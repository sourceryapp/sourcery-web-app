<template>
	<v-layout row>
		<v-flex xs12 sm6 offset-sm3>
            <h1>Profile</h1>

            <v-tabs
                    slider-color="primary"


            >
                <v-tab ripple>
                    General
                </v-tab>
                <v-tab-item class="pt-2">
                    
                    <v-card flat height="140px">
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0"> Current Information </h3>
                                    <p>Name: {{this.user.name}}</p>
                                    <p>Email: {{this.user.email}}</p>
                            </div>
                        </v-card-title>
                    </v-card>

                    <v-card flat>
                        <v-card-title primary-title>
                            <h3 class="headline mb-0"> Change Name </h3>
                        </v-card-title>
                        <v-form @submit.prevent="changeUserName">
                            <v-layout>
                                <v-flex>
                                    <v-text-field 
                                        label="Enter Name"
                                        name="name"
                                        id="name"
                                        v-model="name">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-btn 
                                    :disabled="!nameIsValid"
                                    type="submit"
                                    >
                                    Submit
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-card>
                </v-tab-item>
                <v-tab ripple>
                    Password
                </v-tab>
                <v-tab-item class="pt-2">
                    <v-card flat>
                    </v-card>
                </v-tab-item>
                <v-tab ripple>
                    Email
                </v-tab>
                <v-tab-item class="pt-2">
                    <v-card flat>
                        <h3>Hello</h3>
                    </v-card>
                </v-tab-item>
            </v-tabs>

		</v-flex>
	</v-layout>
</template>

<script>
    import {user} from '~/store/index.js'
	export default {
		name: "profile",
		data: function() {

		    return {
                name: '',
                email: '',
            }
        },
        methods: {
            changeUserName(name) {
                console.log(this.$store.state.user.name);
            }
        },
        computed: {
            user() {
                return this.$store.getters.activeUser
            },
            nameIsValid() {
                return this.name !== "";
            }
		},
	}
</script>

<style scoped>

</style>
