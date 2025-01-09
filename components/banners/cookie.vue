<template>
    <v-sheet location="bottom" position="fixed" max-width="500" class="pa-6" v-if="!accepted" border="lg opacity-2">
        <p>We use cookies to ensure you get the best experience on our website.</p>
        <div class="d-flex justify-space-between">
            <v-btn color="primary" to="/cookies-notice">More Info</v-btn>
            <v-btn @click="acceptCookies">Accept Cookies</v-btn>
        </div>
        
    </v-sheet>
</template>

<script setup>
const accepted = ref(localStorage.getItem('accepted-cookies') === 'true')

function acceptCookies() {
    localStorage.setItem('accepted-cookies', 'true')
    accepted.value = true
}
</script>