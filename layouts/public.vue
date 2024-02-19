<template>
    <div id="landing-layout">
        <v-app>
            <BannersPurpleCallout :show="isHome && !headerIntersectStore.headerIntersect">
                <p class="white--text">Something's brewing...stay tuned to our new <a href="https://sourceryapp.substack.com/" class="white--text" target="_blank">blog</a>!</p>
            </BannersPurpleCallout>

            <v-fade-transition>
                <HeadersPublicNavigation v-if="headerIntersectStore.headerIntersect" />
            </v-fade-transition>
            
            <v-main>
                <slot />
            </v-main>
        </v-app>
    </div>
</template>

<script setup>
const route = useRoute()
const isHome = computed(() => route.path === '/')
const headerIntersectStore = useHeaderIntersectStore()
headerIntersectStore.setHeaderIntersect(!isHome.value)

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