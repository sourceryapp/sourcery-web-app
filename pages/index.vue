<template>
    <div id="page-home">
        <div class="bg-purple-gradient padded-section" v-intersect="onIntersect">
            <v-container>
                <v-row align="center" justify="center">
                    <v-col cols="auto" class="me-10">
                        <v-img class="header__logo" src="/img/logo-wordmark-white.svg" :width="510" alt=""></v-img>
                        <div class="header__slogan">
                            <p class="text-uppercase d-md-flex align-center font-weight-light">
                                <span class="me-1">Open source</span>
                                <IconsSvgSparkle height="12" class="ma-1" />
                                <span class="ma-1">Not for profit</span>
                                <IconsSvgSparkle height="12" class="ma-1" />
                                <span class="ma-1">Community Driven</span>
                            </p>
                        </div>
                        <div class="header__callout">
                            <p class="my-6">
                                Remote access to archival documents.
                            </p>
                        </div>
                        <div class="header__cta-button-group d-flex">
                            <v-btn variant="outlined" size="x-large" @click="showDialog" class="me-6 flex-grow-1">
                                Register
                            </v-btn>
                            <v-btn variant="outlined" size="x-large" to="/login" class="flex-grow-1">
                                Login
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col cols="auto">
                        <v-img class="header__mockup d-none d-md-block" src="~/assets/doublephone-sourcery-02-compressed.png" alt="" :width="330"></v-img>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'public'
})

// Pull in the method to update the header/app bar based on page intersection.
const { setHeaderIntersect } = useHeaderIntersectStore()

// Define a handler for the scroll intersecting content
function onIntersect(isIntersecting, entries, observer) {
    setHeaderIntersect(isIntersecting)
}

function showDialog() {
    $nuxt.$dialog.alert({
        title: 'Coming Soon',
        body: 'We are currently in development and will be launching soon. Please check back later.',
        hasCloseIcon: true
    })
}
</script>

<style scoped>
.bg-purple-gradient {
    background: #924fbe;
    background: linear-gradient(112deg,#a66dab,#6851a4);
}

.padded-section {
    padding-top: 5rem;
    padding-bottom: 5rem;
}
.header__slogan {
    font-size: 1.1rem;
}

.header__callout {
    font-size: 1.7rem;
}
</style>