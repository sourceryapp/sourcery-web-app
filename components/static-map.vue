<template>
  <img :src="imgSrc" :alt="alt">
</template>

<script>
export default {
    name: 'StaticMap',
    props: {
        alt: {
            type: String,
            required: false,
            default: ''
        },
        repository: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            base: 'https://maps.googleapis.com/maps/api/staticmap',
            zoom: 12,
            width: 600,
            height: 300,
            type: 'roadmap',
            pitch: 0,
            density: '@2x'
        }
    },
    computed: {
        imgSrc () {
            // Example: https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyD7lXGivWGaINefZAWc_iCFG6YANhBVh2I
            return `${this.base}?center=${this.$utils.addressToEncodedString(this.repository)}&zoom=${this.zoom}&size=${this.width}x${this.height}&markers=color:blue|label:${this.repository.name}|${this.repository.geo._lat},${this.repository.geo._long}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        }
    }
}
</script>

<style scoped>
img {
    width: 100%;
    max-width: 100%;
}
</style>
