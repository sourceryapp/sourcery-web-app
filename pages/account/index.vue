<template>
        <v-layout
            row
            wrap
        >
            <v-flex
                xs12
                class="teal"
            >
                <v-container>
                    <nuxt-child  />
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


                </v-container>

            </v-flex>

            <v-flex
                xs-12
                >

                <v-list >

                    <v-list-tile to="/account/profile"  nuxt active-class>
                        <v-list-tile-action>
                            <v-icon>contact_mail</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile to="/account/payment" nuxt active-class>
                        <v-list-tile-action>
                            <v-icon>credit_card</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Payment Options</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile to="/account/help" nuxt active-class>
                        <v-list-tile-action>
                            <v-icon>help</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Help</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile to="/account/settings" nuxt active-class>
                        <v-list-tile-action>
                            <v-icon>settings</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Settings</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-list-tile @click="dialog=true" nuxt active-class>
                        <v-list-tile-action>
                            <v-icon>power_settings_new</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Log Out</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>


            </v-flex>
        </v-layout>



</template>

<script>
    import md5 from 'md5'
    export default {
        name: "account",
        layout: 'default',
        data() {
            return {
                dialog: false,
            }
        },
        computed: {
            user(){
                return this.$store.getters['auth/activeUser']
            },
            gravatar() {
                return `https://www.gravatar.com/avatar/${md5(this.user.email || '')}?d=mp`;
            }
        },
        methods: {
            async logout() {
                await this.$store.dispatch('auth/signOut');
                this.$router.replace('/login')
            }
        }
    }
</script>

<style scoped>
</style>
