<template>
  <v-app>
    <nuxt />
  </v-app>
</template>

<script>
// import throttle from 'lodash.throttle'
// import lpBeta from '~/components/lp-banner.vue'

export default {
    name: 'LandingBeta',
    components: {
    // 'lp-banner': lpBeta,
    },
    data () {
        return {
            // scrollYPosition:null
        }
    },
    mounted () {
    // let sticky = this.$refs.sticky;
    // window.addEventListener('scroll', throttle(function(e) {

        //     if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        //         sticky.classList.add('sticky--small')

        //     } else {
        //         sticky.classList.remove('sticky--small')

    //     }
    // }, 500));
    },
    head () {
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
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }

            ]
        }
    }
}
</script>

<style>

.sticky {
    /* position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white; */
}

.sticky #logo{
    transition: all .5s;

}
.sticky--small {
    filter:drop-shadow(0 4px 2px #eee);
}
.sticky--small #logo {
    width: 50%
}

.sticky--small #subhead {
    display:none;
}

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
