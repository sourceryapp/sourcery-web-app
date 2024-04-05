<template>
    <div id="page-about" class="py-8">
        <img src="~/assets/sourcery-tubes.png" class="accent-image">
        <v-container>
            <v-row>
                <v-col>
                    <h1 class="text-h3 font-weight-bold mb-8 text-primary">About Sourcery</h1>
                    <p class="mb-8">Sourcery—an open source, not-for-profit, web-based application for providing remote access to archival documents—aims to improve how researchers request document scans from archivists and how archivists fulfill those requests.</p>
                    <h2 class="text-h4 font-weight-bold mb-3 text-primary">For Repositories &amp; Archivists</h2>
                    <p class="mb-8">For archivists, Sourcery provides archivists a streamlined, cross-platform (mobile, tablet, or laptop) reference scanning workflow, including tools to: help clarify, categorize, staff, and track outstanding requests; manage researcher communication; set and easily collect fees (for institutions that charge for these services); assess the true costs of their labor; and report these costs to decision makers in advocating for additional resources and staff.</p>

                    <h2 class="text-h4 font-weight-bold mb-3 text-primary">For Researchers &amp; Requesters</h2>
                    <p>For researchers, Sourcery aims to provide a single, simple interface for requesting remote access to not-yet digitized documents at repositories around the world. With Sourcery on a phone or laptop, a researcher seeking a document can simply enter the document's location and citation information and receive a scan directly from within the app. It aims to provide better tools for communicating with archivists, provide easier payment options, allow for tracking requests placed at multiple archives within a single interface, and integrate with popular research tools like Zotero and Tropy.</p>

                    <p>Existing means of providing remote access to non-digitized sources create confusion for researchers and extra work for already stretched archivists. Sourcery aims to remedy these problems, creating new and more efficient pathways of computer-mediated research and systems to facilitate and properly account for and fund the often unaccounted and under-resourced labor of archivists in providing reference scans. At the same time, Sourcery recognizes that much archival research depends on close contact between researchers and archivists. By providing more effective online access, Sourcery ultimately aims to free up both researchers and archivists to focus on the sustained, mutual journeys of intellectual discovery at the heart of archival research.</p>
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
.accent-image {
  float: right;
  display: inline;
  max-width: 40%;
}

@media (max-width: 800px) {
  .accent-image {
    max-width: 20%;
  }
}
</style>