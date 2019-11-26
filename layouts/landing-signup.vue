<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
    name: 'landing-signup',
    head() {
        return {
            script: [
                {
                    src: "https://code.jquery.com/jquery-3.4.1.min.js",
                    integrity: "sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=",
                    crossorigin: "anonymous"
                }
            ],
            link: [
                {
                    href: "https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css",
                    rel: "stylesheet"
                },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' }

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
