<template>
    <div id="page-roadmap">
        <v-container>
            <h2 class="text-h3 font-weight-medium text-center my-16">Sourcery's Roadmap</h2>
            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <div id="path-bg">
                        <v-row align="center" class="mb-8">
                            <v-col class="col-12 col-sm-6 d-flex justify-center">
                                <v-img class="roadmap-image" src="../public/img/roadmap-illustrations/1.svg" alt=""></v-img>
                            </v-col>
                            <v-col class="order-sm-first col-12 col-sm-6">
                                <h2 class="date mb-2 text-primary">Winter-Spring 2024</h2>
                                <p>Release of Archivesspace plugin.</p>
                                <p>Launch of Sourcery Anywhere (support for requests nationwide).</p>
                                <p>Release of Android native application.</p>
                                <p>Release of "Request with Sourcery" HTML buttons.</p>
                                <p>Support for line breaks &amp; basic rich text in request details.</p>
                            </v-col>
                        </v-row>
                        <v-row align="center" class="mb-8">
                            <v-col class="col-12 col-sm-6 d-flex justify-center">
                                <v-img class="roadmap-image" src="../public/img/roadmap-illustrations/2.svg" alt=""></v-img>
                            </v-col>
                            <v-col class="col-12 col-sm-6">
                                <h2 class="date mb-2 text-primary">Summer-Fall 2024</h2>
                                <p>Launch of minimal computing version for users in low-bandwidth areas.</p>
                                <p>Release of Tropy plugin.</p>
                                <p>Support for institutional analytics.</p>
                            </v-col>
                        </v-row>
                        <v-row align="center" class="mb-8">
                            <v-col class="col-12 col-sm-6 d-flex justify-center">
                                <v-img class="roadmap-image" src="../public/img/roadmap-illustrations/3.svg" alt=""></v-img>
                            </v-col>
                            <v-col class="order-sm-first col-12 col-sm-6">
                                <h2 class="date mb-2 text-primary">2025 and Beyond</h2>
                                <p>Launch of in-app payments.</p>
                                <p>Pilot launch of third-party, peer-to-peer scanning services.</p>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
            
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'public'
})
</script>

<style>
#path-bg {
  background: url('../public/img/roadmap-illustrations/path.svg');
  background-origin: content-box;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 80%;
}
</style>