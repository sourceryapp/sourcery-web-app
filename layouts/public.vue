<template>
    <div id="public-layout">
        <v-app>
            <BannersPurpleCallout :show="isHome && headerIntersectStore.headerIntersect">
                <p class="text-white mb-0">We're hiring Community Ambassadors in Boston and Washington, DC. For more information, visit our <NuxtLink to="ambassadors" class="text-white">ambassadors page</NuxtLink>!</p>
            </BannersPurpleCallout>

            <v-fade-transition>
                <HeadersPublicNavigation />
            </v-fade-transition>
            
            <v-main>
                <slot />
                <banners-cookie></banners-cookie>
            </v-main>

            <footer class="bg-surface-variant py-10">
                <v-container>
                    <v-row align="center" justify="center">
                        <v-col cols="auto">
                            <NuxtLink to="/" class="text-center">
                                <img :width="300" :src="theme.global.current.value.dark ? '/img/logo-wordmark-dark.svg' : '/img/logo-wordmark.svg'" alt="">
                            </NuxtLink>
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-center align-center my-3">
                        <IconsGooglePlay :width="150" />
                        <v-btn href="https://twitter.com/Sourcery_App" size="x-large" variant="text" color="primary" icon="mdi-twitter" border="none" class="mx-2"></v-btn>
                    </div>

                    <p class="text-body-2 text-center">Sourcery is a project of <a href="https://digitalscholar.org/">Digital Scholar</a>, a nonprofit organization dedicated to the development of software and services for researchers and cultural heritage institutions, in partnership with <a href="https://greenhousestudios.uconn.edu/">Greenhouse Studios | Scholarly Communications Design</a> at UConn.</p>
                </v-container>
            </footer>
        </v-app>
    </div>
</template>

<script setup>
import { useTheme } from 'vuetify'

const route = useRoute()
const theme = useTheme()
const isHome = computed(() => route.path === '/')

const config = useRuntimeConfig()

// Set up some show/hide for the header based on section intersect
const headerIntersectStore = useHeaderIntersectStore()
headerIntersectStore.setHeaderIntersect(isHome.value)

useHead({
    link: [
        {
            href: 'https://fonts.googleapis.com/css?family=Fira+Sans&display=swap',
            rel: 'stylesheet'
        },
        {
            href: 'https://fonts.googleapis.com/css?family=Barlow:100,200,300,400,500,600,700,800,900&display=swap',
            rel: 'stylesheet'
        }
    ]
})
</script>