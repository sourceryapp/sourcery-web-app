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
                    <v-col cols="auto">
                        <v-img class="header__mockup d-none d-md-block" src="~/assets/doublephone-sourcery-02-compressed.png" alt="" :width="330"></v-img>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <div class="padded-section bg-surface-variant">
            <v-container>
                <v-row class="mb-10 px-6" justify="center">
                    <v-col cols="auto">
                        <v-img class="section-img" :width="400" src="/img/landing-illustrations/undraw_faq_rjoy.svg" alt=""></v-img>
                    </v-col>
                    <v-col class="order-sm-first me-5" cols="auto">
                        <h1 id="how" class="d-inline-block">How does Sourcery work?</h1>
                    </v-col>
                </v-row>

                <v-row class="mb-8">
                    <v-col md="4" cols="12" align="center">
                        <h2 class="mb-8 text-primary">For Researchers</h2>
                        <v-img src="/img/landing-illustrations/undraw_researching_22gp.svg" :width="300" class="ma-4"></v-img>
                    </v-col>
                    <v-col md="8">
                        <p>The Sourcery app allows researchers to request scans of not-yet digitized documents from any archive through a single login and interface, accessible from any device. With Sourcery on a phone or laptop, a researcher seeking a document can simply enter the document's location and citation information and receive a scan directly within the app. It aims to provide better tools for communicating with archivists, easier payment options, tracking of requests placed at multiple institutions, and integration with popular research tools like <a href="https://www.zotero.org/">Zotero</a> and <a href="https://tropy.org/">Tropy</a>.</p>
                        <v-btn color="primary" size="x-large" to="/register" variant="outlined" class="mt-6">Try Now <i class="mdi mdi-arrow-right-thin"></i></v-btn>
                    </v-col>
                </v-row>

                <v-divider class="mb-8"></v-divider>
                
                <v-row>
                    <v-col md="4" cols="12" align="center">
                        <h2 class="mb-8 text-primary">For Archivists</h2>
                        <v-img src="/img/landing-illustrations/undraw_collecting_fjjl.svg" :width="300" class="ma-4"></v-img>
                    </v-col>
                    <v-col md="8">
                        <p>Sourcery—an open source, not-for-profit, web-based application for providing remote access to archival documents—aims to improve how researchers request document scans from archivists and provide archivists with better tools for fulfilling those requests. Sourcery provides archivists a streamlined, cross-platform (mobile, tablet, or laptop) reference scanning workflow, including tools to: help clarify, categorize, staff, and track outstanding requests; manage researcher communication; set and easily collect fees (for institutions that charge for these services); assess the true costs of their labor; and report these costs to decision makers in advocating for additional resources and staff.</p>

                        <div class="text-center d-flex align-center justify-center my-4">
                            <v-img src="/img/sparkle-circle.svg" :height="40" class="sparkle" :style="$vuetify.theme.dark ? 'filter: invert(1) hue-rotate(180deg)' : ''"></v-img>
                        </div>

                        <p>Existing means of providing remote access to non-digitized sources create confusion for researchers and extra work for already stretched archivists. Sourcery aims to remedy these problems, creating new and more efficient pathways of computer-mediated research and systems to facilitate and properly account for and fund the often unaccounted and under-resourced labor of archivists in providing reference scans. At the same time, Sourcery recognizes that much archival research depends on close contact between researchers and archivists. By providing more effective online access, Sourcery ultimately aims to free up both researchers and archivists to focus on the sustained, mutual journeys of intellectual discovery at the heart of archival research.</p>

                        <v-btn color="primary" size="x-large" to="/join-us" variant="outlined" class="mt-6">Join Us <i class="mdi mdi-arrow-right-thin"></i></v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <v-container class="padded-section">
            <h1 id="meet" class="mb-9 text-center">How Sourcery Can Work for Your Institution</h1>

            <v-row align="center" justify="center" class="mb-5 px-6">
                <v-col md="2" cols="12" class="text-center">
                    <IconsSvgOptimize />
                </v-col>
                <v-col md="6" cols="12">
                    <h2 class="text-primary">
                    Optimize your Research Requests Workflow
                    </h2>
                    <p>Manage requests for document scans and other researcher requests from a simple, intuitive dashboard. Fulfill requests on any device connected to the internet with the device's camera or by uploading a pdf, jpg, png, or other file.</p>
                </v-col>
            </v-row>

            <v-row align="center" justify="center" class="mb-5 px-6">
                <v-col md="2" cols="12" class="text-center">
                    <IconsSvgCommunicate />
                </v-col>
                <v-col md="6" cols="12">
                    <h2 class="text-primary">
                    Communicate Directly
                    </h2>
                    <p>Ask and answer questions, make clarifications, and more through the in-app, per-request message feature. Declutter your inbox and streamline correspondance right in the app.</p>
                </v-col>
            </v-row>

            <v-row align="center" justify="center" class="mb-5 px-6">
                <v-col md="2" cols="12" class="text-center">
                    <IconsSvgAnalytics />
                </v-col>
                <v-col md="6" cols="12">
                    <h2 class="text-primary">
                    Access Rich Usage Analytics
                    </h2>
                    <p>See your institution's average turnaround time, most common file type requests, geographical areas of requests, new and repeat requesters, average file size, and more from the Institutional Analytics feature.</p>
                </v-col>
            </v-row>
        </v-container>


        <div class="bg-surface-variant">
            <v-container class="padded-section">
                <v-row>
                    <v-col cols="12" md="9">
                        <h1 class="mb-9">Who is behind Sourcery?</h1>
                        <p>Sourcery emerges from the design process of <a href="https://greenhousestudios.uconn.edu/" class="partnerlink">Greenhouse Studios</a>, a digital scholarship incubator a the <a href="https://uconn.edu">University of Connecticut</a>, and from the project team's past work and ongoing interests in open source research software for the humanities. Sourcery is a project of the <a href="https://digitalscholar.org/">Corporation for Digital Scholarship</a>, a not-for-profit organization.</p>
                    </v-col>
                    <v-col cols="12" md="3" align="center"><v-img src="/img/landing-illustrations/undraw_absorbed_in_xahs.svg" alt="" :width="280"></v-img></v-col>
                </v-row>

            </v-container>
        </div>

        <v-container class="padded-section">
            <v-row align="center" justify="center" class="px-6">
                <v-col cols="auto" class="px-5">
                    <v-img src="/img/landing-illustrations/undraw_enter_uhqk.svg" alt="" :width="280"></v-img>
                </v-col>
                <v-col class="order-sm-first me-10" cols="12" sm="6">
                    <h1 id="ready" class="mb-7">Ready to try Sourcery?</h1>
                    <v-row class="mb-6">
                        <v-col>
                            <v-btn color="primary" size="x-large" height="76px" block @click="showDialog">Register</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn to="/login" color="primary" size="x-large" height="76px" block variant="outlined">Log In</v-btn>
                        </v-col>
                    </v-row>
                    <v-btn to="/about" variant="text" block>Learn More</v-btn>
                </v-col>
            </v-row>
        </v-container>
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