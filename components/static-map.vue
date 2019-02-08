<template>
    <img :src="imgSrc" :alt="alt">
</template>

<script>
	export default {
        name: "StaticMap",
		data() {
			return {
                base: 'https://api.mapbox.com/styles/v1/mapbox/',
                style: 'streets-v11',
                zoom: 10,
                width: 300,
                height: 200,
                bearing: 0,
                pitch: 0,
                density: '@2x',
			}
        },
        props: {
            alt: String,
            lat: Number,
            long: Number,
        },
        computed: {
            imgSrc: function(){
                return `${this.base}${this.style}/static/${this.long},${this.lat},${this.zoom},${this.bearing},${this.pitch}/${this.width}x${this.height}${this.density}?access_token=${process.env.MAPBOX_API_KEY}`;
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
