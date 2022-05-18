<template>
  <div id="content" class="site-content">
    <v-fade-transition>
      <sourcery-header
        v-if="!isIntersecting"
        style="position:fixed; width: 100%"
      />
    </v-fade-transition>
    <header
      v-intersect="onIntersect"
      class="landing-header"
    >
      <div class="header-content">
        <img
          class="header__logo"
          src="../static/img/logo-wordmark-white.svg"
          alt=""
        >
        <img
          class="header__mockup"
          src="../static/img/sourcery-mockup-no-shadow.png"
          alt=""
        >
        <div class="header__buttons">
          <v-btn
            to="/register"
            x-large
            block
            color="white"
            class="black--text text-h5 font-weight-bold"
            height="76px"
            depressed
          >
            Sign Up
          </v-btn>
          <!-- <v-btn
            to="/join-us"
            x-large
            block
            color="white"
            class="black--text text-h5 font-weight-bold"
            height="76px"
          >
            Sign Up
          </v-btn> -->
          <v-btn
            to="/login"
            x-large
            block
            color="white"
            class="black--text text-h5 font-weight-bold"
            height="76px"
            outlined
          >
            Log In
          </v-btn>
          <p class="mt-2 text-white">
            Interested in working with Sourcery as an institution? <nuxt-link class="link-white" to="/join-us">
              Let us know.
            </nuxt-link>
          </p>
        </div>
        <div class="header__slogan">
          <p>Delivering archival documents straight to your device</p>
        </div>
      </div>
    </header>
    <v-flex
      xs12
      sm10
      md8
      lg6
      xl4
      offset-sm1
      offset-md2
      offset-lg3
      offset-xl4
    >
      <v-container>
        <h1 id="meet" class="mt-8">
          Meet Sourcery
        </h1>
        <v-row class="align-center">
          <v-col>
            <img
              class="feature-illustration"
              src="../static/img/landing-illustrations/undraw_researching_22gp.svg"
              alt=""
            >
          </v-col>
          <v-col class="col-12 col-sm-6">
            <div class="feature-desc">
              <h4 class="feature-title">
                Easy document requests
              </h4>
              <p class="feature-text">
                Request a document using just a citation and where
                it’s located.
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col>
            <img
              class="feature-illustration"
              src="../static/img/landing-illustrations/undraw_collaborators_prrw.svg"
              alt=""
            >
          </v-col>
          <v-col class="order-sm-first col-12 col-sm-6">
            <div class="feature-desc ">
              <h4 class="feature-title">
                High quality sources
              </h4>
              <p class="feature-text">
                Receive high resolution scans from institutions and
                Sourcery-registered researchers.
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col>
            <img
              class="feature-illustration"
              src="../static/img/landing-illustrations/undraw_folder_files_nweq.svg"
              alt=""
            >
          </v-col>
          <v-col class="col-12 col-sm-6">
            <div class="feature-desc">
              <h4 class="feature-title">
                Streamlining workflows for institutions
              </h4>
              <p class="feature-text">
                Give archival staff and patrons one easy platform
                for requesting and receiving scans.
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col>
            <img
              class="feature-illustration"
              src="../static/img/landing-illustrations/undraw_wallet_aym5.svg"
              alt=""
            >
          </v-col>
          <v-col class="order-sm-first col-12 col-sm-6">
            <div class="feature-desc">
              <h4 class="feature-title">
                Cut the travel fees
              </h4>
              <p class="feature-text">
                Save your wallet from expensive flights and
                transportation.
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col>
            <img
              class="feature-illustration"
              src="../static/img/landing-illustrations/undraw_absorbed_in_xahs.svg"
              alt=""
            >
          </v-col>
          <v-col class="col-12 col-sm-6">
            <div class="feature-desc">
              <h4 class="feature-title">
                Get back to what’s important
              </h4>
              <p class="feature-text">
                Gain efficient, affordable access with Sourcery.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
    <section id="how-does-sourcery-work">
      <div class="section-container">
        <v-container>
          <v-row class="align-center">
            <v-col>
              <img
                class="section-img"
                src="../static/img/landing-illustrations/undraw_faq_rjoy.svg"
                alt=""
              >
            </v-col>
            <v-col class="order-sm-first col-12 col-sm-6">
              <h1 id="how" ref="how" class="text">
                How does Sourcery work?
              </h1>
            </v-col>
          </v-row>
        </v-container>
        <div class="paragraphs">
          <p class="medium">
            The Sourcery app allows researchers to request documents
            directly from our affiliated institutions through a single login and interface,
            accessible from any device.
            It aims to streamline the process for both researchers and repositories,
            offering a simple request and fulfillment workflow and a seamless, secure payments system.
          </p>
          <img
            src="../static/img/sparkle-circle.svg"
            class="sparkle"
            :style="$vuetify.theme.dark ? 'filter: invert(1) hue-rotate(180deg)' : ''"
          >
          <p class="text indiv">
            Sourcery is a not-for-profit service that gives researchers
            access to documents that can't be found online.
            During the beta period, users can request documents from select institutions.
            Just provide the document’s citation information, and Sourcery will do the rest.
          </p>
          <img
            src="../static/img/sparkle-circle.svg"
            class="sparkle"
            :style="$vuetify.theme.dark ? 'filter: invert(1) hue-rotate(180deg)' : ''"
          >
          <p class="text indiv">
            Sourcery emerges from the design process of
            <a
              href="https://greenhousestudios.uconn.edu/"
              class="partnerlink"
            >Greenhouse Studios</a>
            and from the project team’s past work and ongoing
            interests in research software for the humanities.
            Greenhouse Studios, an incubator for digital scholarship
            at the University of Connecticut, is a shared initiative
            of the
            <a
              href="https://lib.uconn.edu/"
              class="partnerlink"
            >UConn Library</a>,
            <a
              href="https://sfa.uconn.edu/"
              class="partnerlink"
            >School of Fine Arts</a>, and the
            <a
              href="https://clas.uconn.edu/"
              class="partnerlink"
            >College of Liberal Arts and Sciences</a>. Sourcery is a project of the
            <a
              href="https://digitalscholar.org/"
              class="partnerlink"
            >
              Corporation for Digital Scholarship</a>, a not-for-profit organization.
          </p>
        </div>
        <v-btn
          to="/about"
          color="primary"
          outlined
          x-large
          :block="$vuetify.breakpoint.mobile"
        >
          Learn More
        </v-btn>
      </div>
    </section>

    <section id="cta">
      <div class="section-container">
        <v-container>
          <v-row class="align-center">
            <v-col>
              <img
                src="../static/img/landing-illustrations/undraw_enter_uhqk.svg"
                alt=""
                class="section-img ready-img"
              >
            </v-col>
            <v-col class="order-sm-first col-12 col-sm-6">
              <h1 id="ready">
                Ready to try Sourcery?
              </h1>
            </v-col>
          </v-row>
        </v-container>
        <div class="cta-buttons">
          <v-btn
            to="/login"
            x-large
            block
            color="primary"
            class="text-h5 font-weight-bold"
            height="76px"
            outlined
          >
            Log In
          </v-btn>
          <v-btn
            to="/register"
            x-large
            block
            color="primary"
            class="text-h5 font-weight-bold"
            height="76px"
            depressed
          >
            Sign Up
          </v-btn>
          <!-- <v-btn
            to="/join-us"
            x-large
            block
            color="white"
            class="black--text text-h5 font-weight-bold"
            height="76px"
          >
            Sign Up
          </v-btn> -->
          <p>
            Interested in working with Sourcery as an institution? <nuxt-link to="/join-us">
              Let us know.
            </nuxt-link>
          </p>
        </div>
      </div>
    </section>

    <sourcery-footer :text="true" />
    <cookie-law
      theme="dark-lime"
      message="We use cookies to ensure you get the best experience on our website."
      button-text="OK"
      button-link="/cookies-notice"
    />
  </div>
</template>

<script>
/**
 * Cookie Consent
 * @url https://github.com/apertureless/vue-cookie-law#--vue-cookie-law
 */
import CookieLaw from 'vue-cookie-law'
import Footer from '../components/footer'
import Header from '../components/purple-header.vue'

export default {
    name: 'Home',
    components: {
        CookieLaw,
        'sourcery-footer': Footer,
        'sourcery-header': Header
    },
    layout: 'landing-beta',
    middleware: null,
    data: () => ({
        isIntersecting: true,
        mailchimpLink: 'https://mailchi.mp/4de98c4698dd/coming-soon'
    }),
    head () {
        return {
            script: [
                {
                    src:
                        'https://cdnjs.cloudflare.com/ajax/libs/stickybits/3.7.2/stickybits.min.js',
                    integrity:
                        'sha256-pytD+8MI6QUO5dayaQjTboZuqXv8YU05ZuQFl4NijpM=',
                    crossorigin: 'anonymous'
                }
            ]
        }
    },
    computed: {
        isProd () {
            if (process.env.BASE_URL && process.env.BASE_URL === 'https://sourceryapp.org') {
                return true
            }
            return false
        }
    },
    methods: {
        smoothScroll (target) {
            let scrollContainer = target
            do {
                // find scroll container
                scrollContainer = scrollContainer.parentNode
                if (!scrollContainer) {
                    return
                }
                scrollContainer.scrollTop += 1
            } while (scrollContainer.scrollTop === 0)

            let targetY = 0
            do {
                // find the top of target relatively to the container
                if (target === scrollContainer) {
                    break
                }
                targetY += target.offsetTop
            } while ((target = target.offsetParent))

            const scroller = function (c, a, b, i) {
                i++
                if (i > 30) {
                    return
                }
                c.scrollTop = a + ((b - a) / 30) * i
                setTimeout(function () {
                    scroller(c, a, b, i)
                }, 20)
            }
            // start scrolling
            scroller(scrollContainer, scrollContainer.scrollTop, targetY, 0)
        },
        onIntersect (entries, observer) {
            this.isIntersecting = entries[0].isIntersecting
        }
    }
}
</script>

<style>
body {
    --sourcery-500: #654ea3;
    --sourcery-700: #413268;
    --sourcery-900: #292043;
    --max-width: 840px;
}
.Cookie--dark-lime a.Cookie__button {
    background-color: grey;
}
body {
    margin: 0;
}
p {
    font-size: 18px;
    margin: 0;
    color: var(--v-primary-base);
}
h1 {
    font-size: 32px;
    line-height: 38px;
}
.color-500 {
  color: var(--sourcery-500)
}
.color-700 {
    color: var(--sourcery-700);
}
.color-900 {
    color: var(--sourcery-900);
}
#meet {
    text-align: center;
    margin-bottom: 36px;
}
.landing-header {
    padding: 48px 24px;
    background: rgb(146, 79, 190);
    background: linear-gradient(
        135deg,
        rgba(146, 79, 190, 1) 0%,
        rgba(111, 77, 170, 1) 50%
    );
}
.header-content {
    max-width: var(--max-width);
    margin: 0 auto;
    display: grid;
    align-items: center;
    grid-template-areas: 'logo' 'mockup' 'buttons' 'slogan';
    row-gap: 12px;
}
.header__logo {
    width: 100%;
    max-height: 60px;
    grid-area: logo;
}
.header__mockup {
    width: 100%;
    padding: 24px 0;
    grid-area: mockup;
    filter: drop-shadow(16px 8px 8px rgb(41, 32, 67, 0.3));
}
.header__buttons {
    grid-area: buttons;
}
.header__buttons a:first-child {
    margin-bottom: 12px;
}
.header__slogan {
    grid-area: slogan;
    color: white;
}
.header__slogan h1 {
    margin-bottom: 12px;
}
.header__slogan p {
    color: white;
    font-size: 24px;
}
.text-white {
  color: white;
}
.text-white .link-white {
  color: white;
}
.section-container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 48px 24px;
}
.feature:not(:last-child) {
    margin-bottom: 24px;
}
.feature-illustration {
    width: 100%;
    padding: 24px;
}
.feature-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
}
.feature-text {
    font-weight: 500;
}
#how-does-sourcery-work {
    background: hsla(260, 75%, 75%, 0.05);
}
.section-img {
    width: 100%;
    padding: 24px;
}
#how {
    margin-bottom: 12px;
}
.medium {
    font-weight: 500;
}
.sparkle {
    display: block;
    margin: 18px auto;
    background-color: white;
    border-radius: 50%;
}
.paragraphs {
    margin-bottom: 24px;
}
.ready-img {
    height: 300px;
}
.cta-buttons {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
}
#ready {
    margin-bottom: 24px;
}
@media only screen and (min-width: 600px) {
    .landing-header {
        padding: 96px 24px;
    }
    .header-content {
        grid-template-areas: 'logo mockup' 'slogan mockup' 'buttons mockup';
        column-gap: 96px;
        grid-template-columns: 5fr 4fr;
    }
    .header__mockup {
        padding: 0;
        width: auto;
        max-width: 100%;
        object-fit: contain;
    }
    .feature {
        height: 240px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
    }
    .feature-illustration {
        flex: 1;
        height: 100%;
    }
    .feature__text-first .feature-desc {
        order: -1;
    }
    .feature-desc {
        flex: 1;
    }
    .section-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
    }
    .section-img {
        width: 100%;
        order: 1;
    }
    .section-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .cta-buttons {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: none;
        align-items: center;
        gap: 48px;
    }
}
</style>
