<template>
    <div id="page-home">
        <div class="bg-purple-gradient padded-section px-6 px-sm-0 text-white" v-intersect="onIntersect">
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
                        <p class="my-6 header__callout">
                            Remote access to archival documents.
                        </p>
                        <div class="header__cta-button-group d-flex">
                            <v-btn variant="outlined" size="x-large" @click="showDialog" class="me-6 flex-grow-1">
                                Register
                            </v-btn>
                            <v-btn variant="outlined" size="x-large" to="/login" class="flex-grow-1">
                                Login
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <div class="padded-section bg-surface-variant">
            <v-container>
                <v-row class="mb-10">
                    <v-col md="4" cols="12" align="center">
                        <h2 class="mb-8 text-primary">For Researchers</h2>
                        <!-- <v-img src="/img/landing-illustrations/undraw_researching_22gp.svg" :width="300" class="ma-4"></v-img> -->
                    </v-col>
                    <v-col md="8">
                        <p>Sourcery allows researchers to request scans of not-yet digitized documents from any archive through a single login interface, accessible from any device. With Sourcery on a phone or laptop, you can simply enter the document's location and citation information and receive a scan directly within the app. It aims to provide better tools for communicating with archivists, easier payment options, tracking of requests placed at multiple institutions, and integration with popular research tools like <a href="https://www.zotero.org/">Zotero</a> and <a href="https://tropy.org/">Tropy</a>.</p>
                        <v-btn color="primary" size="x-large" to="/register" variant="outlined" class="mt-6">Try Now <i class="mdi mdi-arrow-right-thin"></i></v-btn>
                    </v-col>
                </v-row>

                <v-divider class="mb-10"></v-divider>
                
                <v-row>
                    <v-col md="4" cols="12" align="center">
                        <h2 class="mb-8 text-primary">For Archivists</h2>
                        <!-- <v-img src="/img/landing-illustrations/undraw_collecting_fjjl.svg" :width="300" class="ma-4"></v-img> -->
                    </v-col>
                    <v-col md="8">
                        <p>Sourcery aims to improve how researchers request document scans from archivists and provide archivists with better tools for fulfilling those requests. Sourcery provides archivists a streamlined, cross-platform (mobile, tablet, or laptop) reference scanning workflow, including tools to: help clarify, categorize, staff, and track outstanding requests; manage researcher communication; set and easily collect fees (for institutions that charge for these services); assess the true costs of their labor; and report these costs to decision makers in advocating for additional resources and staff.</p>

                        <v-btn color="primary" size="x-large" to="/join-us" variant="outlined" class="mt-6">Join Us <i class="mdi mdi-arrow-right-thin"></i></v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        


        <div>
            <v-container class="padded-section">
                <v-row>
                    <v-col cols="12" md="9">
                        <h1 class="mb-9">Who is behind Sourcery?</h1>
                        <p>Sourcery emerges from the design process of <a href="https://greenhousestudios.uconn.edu/" class="partnerlink">Greenhouse Studios</a>, a digital scholarship incubator at the <a href="https://uconn.edu">University of Connecticut</a>, and from the project team's past work and ongoing interests in open-source research software for the humanities. Sourcery is a project of <a href="https://digitalscholar.org/">Digital Scholar</a>, a not-for-profit organization.</p>
                    </v-col>
                    <v-col cols="12" md="3" align="center"><v-img src="/img/landing-illustrations/undraw_absorbed_in_xahs.svg" alt="" :width="280"></v-img></v-col>
                </v-row>

            </v-container>
        </div>


        <v-dialog v-model="dialogVisible" max-width="650">
            <v-card id="modal-card" title="Ready to try Sourcery?">
                <template v-slot:append>
                    <v-btn rounded="md" @click="dialogVisible = false" icon="mdi-close"></v-btn>
                </template>
                <v-card-text>
                    <v-container>
                        <v-row align="stretch">
                            <v-col cols="6">
                                <NuxtLink
                                    to="/register"
                                    class="bg-primary d-block text-center text-decoration-none"
                                    style="height: 280px;"
                                >
                                    <div class="fill-height d-flex flex-column justify-center">
                                        <v-img src="/img/icons_document.png" max-height="140"></v-img>
                                        <span class="text-h6 font-weight-bold mt-4">
                                            Request Documents
                                        </span>
                                    </div>
                                </NuxtLink>
                            </v-col>
                            <v-col cols="6">
                                <NuxtLink
                                    to="/join-us"
                                    class="bg-primary d-block text-center text-decoration-none"
                                    style="height: 280px;"
                                >
                                    <div class="fill-height d-flex flex-column justify-center">
                                        <v-img src="/img/icons_institution.png" max-height="140"></v-img>
                                        <span class="text-h6 font-weight-bold mt-4 px-4">
                                            Become a Partner Institution
                                        </span>
                                    </div>
                                </NuxtLink>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <span>
                                    Have an account?
                                    <NuxtLink to="/login">
                                    Log in.
                                    </NuxtLink>
                                </span>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useTheme } from 'vuetify'

definePageMeta({
    layout: 'public'
})

// Utilize the vuetify theme for light/dark
const theme = useTheme()

// Set a variable for the CTA dialog visibility
const dialogVisible = ref(false)

// Pull in the method to update the header/app bar based on page intersection.
const { setHeaderIntersect } = useHeaderIntersectStore()

// Define a handler for the scroll intersecting content
function onIntersect(isIntersecting, entries, observer) {
    setHeaderIntersect(isIntersecting)
}

function showDialog() {
    dialogVisible.value = true
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