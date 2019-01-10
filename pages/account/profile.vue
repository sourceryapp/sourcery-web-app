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
                    <v-card flat>
                        <v-form @submit.prevent="registerSubmit">
                            <v-text-field type="text" name="name" label="Name" v-model="name"></v-text-field>
                            <span class="red--text" v-for="(err, index) in errors.name" :key="index">{{err}}</span>
                            <v-text-field type="email" name="email" label="Email Address" v-model="email" :autocomplete="false"></v-text-field>
                            <span class="red--text" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
                            <v-btn type="submit" value="Save" color="primary">Save</v-btn>
                        </v-form>
                    </v-card>
                </v-tab-item>
                <v-tab ripple>
                    Change Password
                </v-tab>
                <v-tab-item class="pt-2">
                    <v-card flat>
                        <v-form @submit.prevent="registerSubmit">

                            <v-text-field type="password" name="cpassword" v-model="cpassword"  autocomplete="false" label="Current Password"></v-text-field>
                            <span class="red--text" v-for="(err, index) in errors.confirm_password" :key="index">{{err}}</span>

                            <v-text-field type="password" name="npassword1" v-model="npassword1"  autocomplete="false" label="New Password"></v-text-field>
                            <span class="red--text" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
                            <v-text-field type="password" name="npassword2" v-model="npassword2"  autocomplete="false" label="Confirm New Password"></v-text-field>
                            <span class="red--text" v-for="(err, index) in errors.confirm_password" :key="index">{{err}}</span>
                            <v-btn type="submit" value="Update" color="primary">Update</v-btn>
                        </v-form>
                    </v-card>
                </v-tab-item>
            </v-tabs>

		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		name: "profile",
		data: function() {

		    return {
                name: '',
                email: '',
                errors: {
                    name: [],
                    email: [],
                    password: [],
                    confirm_password: [],
                },
                cpassword: '',      // Current Password
                npassword1: '',     // New password
                npassword2: '',     // New password confirmed
            }
        },
        computed: {
            user() {
                return this.$store.getters.activeUser
            }
		},
	}
</script>

<style scoped>

</style>
