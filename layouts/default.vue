<template>
    <div id="default-layout">
        <v-app>
            <v-navigation-drawer v-model="drawerOpen" :location="drawerLocation" :class="navigationDrawerClasses" :temporary="mobile">
                <v-list class="bg-purple-gradient-alt py-5">
                    <v-list-item :prepend-avatar="userIcon"></v-list-item>
                    <v-list-item>
                        <v-list-item-title class="text-h6 mb-2 text-white" v-if="authUser?.id && authUser?.name">{{ authUser.name }}</v-list-item-title>
                        <v-list-item-title class="text-h6 mb-2 text-white" v-else>Guest</v-list-item-title>

                        <v-list-item-subtitle class="text-white" v-if="authUser?.email">{{ authUser.email }}</v-list-item-subtitle>
                        <v-list-item-subtitle class="text-white" v-else>Log in to place &amp; manage requests.</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <v-list class="px-2">

                    <template v-if="organizationNavigationItems.length > 0">
                        <v-list-subheader>Organizations</v-list-subheader>
                        <v-list-item v-for="item in organizationNavigationItems" :to="item.link" color="primary" rounded>
                            <template v-slot:prepend>
                                <v-icon>{{ item.icon }}</v-icon>
                            </template>
                            <v-list-item-title class="text-subtitle-2">{{ item.title }}</v-list-item-title>
                        </v-list-item>
                        <v-divider class="ma-2"></v-divider>
                    </template>

                    <v-list-subheader v-if="userOrgsAndMembers.length > 0">Personal</v-list-subheader>
                    <v-list-item v-for="item in primaryNavigationItems" :to="item.link" color="primary" rounded v-show="item.show">
                        <template v-slot:prepend>
                            <v-icon v-if="!item.new">{{ item.icon }}</v-icon>
                            <v-badge v-else color="primary" content="NEW">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-badge>
                        </template>
                        <v-list-item-title class="text-subtitle-2">{{ item.title }}</v-list-item-title>
                    </v-list-item>

                    <template v-if="authUser">
                        <v-divider class="ma-2"></v-divider>
                        <v-list-subheader>Account</v-list-subheader>
                        <v-list-item v-for="item in secondaryNavigationItems" :to="item.link" color="primary" rounded>
                            <template v-slot:prepend>
                                <v-icon>{{ item.icon }}</v-icon>
                            </template>
                            <v-list-item-title class="text-subtitle-2">{{ item.title }}</v-list-item-title>
                        </v-list-item>

                        <template v-if="authUser?.admin">
                            <v-divider class="ma-2"></v-divider>
                            <v-list-subheader>Admin</v-list-subheader>
                            <v-list-item v-for="item in adminNavigationItems" :to="item.link" color="primary" rounded>
                                <template v-slot:prepend>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </template>
                                <v-list-item-title class="text-subtitle-2">{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </template>
                    </template>

                    <v-divider class="ma-2"></v-divider>

                    <v-list-item color="primary" rounded to="/feedback">
                        <template v-slot:prepend>
                            <v-icon>mdi-comment-quote</v-icon>
                        </template>
                        <v-list-item-title class="text-subtitle-2">Feedback &amp; Support</v-list-item-title>
                    </v-list-item>

                    <v-list-item color="primary" rounded @click="toggleTheme" :active="false">
                        <template v-slot:prepend>
                            <v-icon>mdi-theme-light-dark</v-icon>
                        </template>
                        <v-list-item-title class="text-subtitle-2">Toggle Theme</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="logout" color="primary" rounded v-if="authUser">
                        <template v-slot:prepend>
                            <v-icon>mdi-logout</v-icon>
                        </template>
                        <v-list-item-title class="text-subtitle-2">Logout</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/login" color="primary" rounded v-else>
                        <template v-slot:prepend>
                            <v-icon>mdi-login</v-icon>
                        </template>
                        <v-list-item-title class="text-subtitle-2">Login</v-list-item-title>
                    </v-list-item>

                    <v-divider class="ma-2" v-if="mobile"></v-divider>
                    <v-list-item v-for="item in bottomNavigationItems" :to="item.link" color="primary" rounded density="compact" v-if="mobile">
                        <v-list-item-title class="text-caption">{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>

                <template v-slot:append>
                    <v-list class="px-2" density="compact" v-if="!mobile">
                        <v-list-item v-for="item in bottomNavigationItems" :to="item.link" color="primary" rounded density="compact">
                            <v-list-item-title class="text-caption">{{ item.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </template>
            </v-navigation-drawer>
            <v-app-bar scroll-behavior="elevate" color="background">
                <v-app-bar-nav-icon @click="drawerOpen = !drawerOpen" v-if="mobile" border="none"></v-app-bar-nav-icon>
                <v-spacer></v-spacer>
                <NuxtLink to="/dashboard" class="d-block">
                    <v-img :src="theme.global.current.value.dark ? '/img/logo-wordmark-dark.svg' : '/img/logo-wordmark.svg'" alt="Sourcery Logo" width="150"></v-img>
                </NuxtLink>
                <v-spacer></v-spacer>
            </v-app-bar>
            <v-main>
                <slot />
                <banners-cookie></banners-cookie>
            </v-main>
        </v-app>
    </div>
</template>

<script setup>
import md5 from 'md5'
import { useDisplay, useTheme } from 'vuetify'

const { authUser, userOrgsAndMembers, fetchUserMetadata, possiblyRefetch, canClaim } = useAuthUser()
const { loadStripe } = useStripe()
const user = useSupabaseUser()
const { logout } = useLogout()
const { mobile } = useDisplay()
const { toggleTheme } = useToggleTheme()
const theme = useTheme()

// Fetch user metadata only once on initial load/refresh from tab out
// Observe the supabase user object for changes and sync user metadata
await callOnce(fetchUserMetadata)
callOnce(loadStripe)
watch(user, possiblyRefetch)

// All user related display helpers
const userIcon = computed(() => {
    return `https://www.gravatar.com/avatar/${md5(authUser?.value?.email || '')}?d=mp`
})

// Layout display helpers
const drawerLocation = computed(() => {
    return mobile.value ? 'bottom' : 'left'
})
const drawerOpen = ref(!mobile.value)

// Navigation Trees
const primaryNavigationItems = ref([
    { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/dashboard', show: true },
    { title: 'Claim Requests', icon: 'mdi-file-document', link: '/requests', new: true, show: authUser.value? canClaim.value : false },
    { title: 'Create Request', icon: 'mdi-plus-circle', link: '/request/create', show: true }
])
const secondaryNavigationItems = ref([
    { title: 'Notifications', icon: 'mdi-message', link: '/notifications' },
    { title: 'Settings', icon: 'mdi-cog', link: '/account/settings' },
    { title: 'Tax Documents', icon: 'mdi-file-document', link: '/account/tax' }
])
const bottomNavigationItems = ref([
    { title: 'Tools & Integrations', link: '/tools' },
    { title: 'Privacy Policy', link: '/privacy' },
    { title: 'Terms and Conditions', link: '/terms' }
])
const adminNavigationItems = ref([
    { title: 'Admin Home', icon: 'mdi-cog', link: '/admin' },
    { title: 'Organizations', icon: 'mdi-domain', link: '/o' },
    { title: 'NPI Requests', icon: 'mdi-earth', link: '/admin/npi' }
])

const organizationNavigationItems = computed(() => {
    return userOrgsAndMembers.value.map(org => {
        return { title: org.name, icon: 'mdi-domain', link: `/o/${org.id}` }
    })
})

const navigationDrawerClasses = computed(() => {
    return {
        'd-print-none': true,
        'mobile-limit-height': mobile.value
    }
})
</script>

<style scoped lang="scss">
@use '../assets/src/scss/vuetify-settings';

.bg-purple-gradient-alt {
    background: rgb(146, 79, 190);
    background: linear-gradient(135deg, rgba(146, 79, 190, 1) 0%, rgba(111, 77, 170, 1) 50%);
}

.mobile-limit-height {
    max-height: 70vh;
}
</style>