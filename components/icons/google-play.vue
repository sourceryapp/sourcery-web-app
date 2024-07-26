<template>
    <a href="https://play.google.com/store/apps/details?id=org.sourcery&pcampaignid=web_share">
        <v-img src="~/assets/GetItOnGooglePlay_Badge_Web_color_English.png" :width="width" ></v-img>
    </a>    
</template>

<script setup>
defineProps({
    width: {
        type: Number,
        default: 200
    }
})
</script>