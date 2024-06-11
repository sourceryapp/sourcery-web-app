<template>
    <div id="page-about">
      <div class="pb-10">
        <v-container>
          <div>
            <h1 class="text-h3 font-weight-medium text-center my-16">About Sourcery</h1>
            <p class="my-16 readable-text-width mx-auto">Sourcery—an open source, not-for-profit, web-based application for providing remote access to archival documents—aims to improve how researchers request document scans from archivists and how archivists fulfill those requests. Existing means of providing remote access to non-digitized sources create confusion for researchers and extra work for already stretched archivists. Sourcery aims to remedy these problems, creating new and more efficient pathways of computer-mediated research and systems to facilitate and properly account for and fund the often unaccounted and under-resourced labor of archivists in providing reference scans. At the same time, Sourcery recognizes that much archival research depends on close contact between researchers and archivists. By providing more effective online access, Sourcery ultimately aims to free up both researchers and archivists to focus on the sustained, mutual journeys of intellectual discovery at the heart of archival research.</p>
          </div>
        </v-container>

        <div class="py-10 bg-surface-variant">
          <v-container>
            <h2 class="text-h4 font-weight-bold mb-10 text-primary text-center">For Researchers</h2>
            <div class="readable-text-width mx-auto">
              <h3 class="text-primary readable-text-width mx-auto mb-2">All Your Requests in One Place</h3>
              <p class="mb-8">A single source for requesting reference scans from any archive.</p>

              <h3 class="text-primary mb-2">Streamlined Workflow</h3>
              <p class="mb-8">Keep trafck of your research requests and communicate with archivists through the in-app chat feature.</p>

              <h3 class="text-primary mb-2">Better for Your Wallet and the Environment</h3>
              <p class="mb-8">Reduce your travel costs and carbon footprint by doing research, even with undigitized collections, digitally.</p>
            </div>
          </v-container>
        </div>


        <div class="py-10">
          <v-container>
            <h2 class="text-h4 font-weight-bold mb-10 text-primary text-center">For Archivists</h2>
            <div class="readable-text-width mx-auto">
              <h3 class="text-primary mb-2">Optimize your Research Requests Workflow</h3>
              <p class="mb-8">Manage requests for document scans and other researcher requests on any device from a simple, intuitive dashboard. Fulfill requests directly from your phone or tablet or by snapping a photo in the stacks or upload a pdf, jpg, TIFF, or other file from your computer.</p>

              <h3 class="text-primary mb-2">Communicate Directly</h3>
              <p class="mb-8">Ask and answer questions and make clarifications through the in-app, per-request Messaging feature. Declutter your email inbox and streamline correspondence right in the app.</p>

              <h3 class="text-primary mb-2">Access Rich Usage Analytics</h3>
              <p class="mb-8">Share and allocate research requests among appropriate staff and keep track of who's doing what. See your institution's average turnaround time, most common file type requests, geographical areas of requests, new and repeat requesters, average file size, and more from the Institutional Analytics feature.</p>
            </div>
          </v-container>
        </div>
      </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'public'
})
</script>

<style>
.padded-section {
    padding-top: 5rem;
    padding-bottom: 5rem;
}

.readable-text-width {
    max-width: 764px;
}
</style>