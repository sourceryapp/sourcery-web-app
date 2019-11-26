<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
    name: 'landing-beta',
    head() {
        return {
            script: [

            ],
            link: [
                {
                    href: 'https://fonts.googleapis.com/css?family=Fira+Sans&display=swap',
                    rel: 'stylesheet'
                },
                {
                    href: 'https://fonts.googleapis.com/css?family=Barlow:100,200,300,400,500,600,700,800,900&display=swap',
                    rel: 'stylesheet'
                },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

            ]
        }
    }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}


</style>
