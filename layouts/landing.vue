<template>
  <v-app>
    <div id="content" class="site-content">
      <div class="fixed-header">
        <BannersFixedCallout :show="isIntersecting">
          <p class="white--text">
            Something's brewing...stay tuned to our new <a href="https://sourceryapp.substack.com/" class="white--text" target="_blank">blog</a>!
          </p>
        </BannersFixedCallout>
        <v-fade-transition>
          <PurpleHeader v-if="!isIntersecting" style="width: 100%" />
        </v-fade-transition>
      </div>
      <slot />
    </div>

  </v-app>
</template>

<script setup>
const isIntersecting = ref(false)

useHead({
  link: [
    {
      href: 'https://fonts.googleapis.com/css?family=Fira+Sans&display=swap',
      rel: 'stylesheet'
    },
    {
      href: 'https://fonts.googleapis.com/css?family=Barlow:100,200,300,400,500,600,700,800,900&display=swap',
      rel: 'stylesheet'
    },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
  ]
})
</script>



<style>
/* .fixed-header {
  position: fixed;
  width: 100%;
  z-index: 1;
}

.sticky #logo {
  transition: all .5s;

}

.sticky--small {
  filter: drop-shadow(0 4px 2px #eee);
}

.sticky--small #logo {
  width: 50%
}

.sticky--small #subhead {
  display: none;
}

html {
  font-family: 'Barlow', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
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
} */
</style>
