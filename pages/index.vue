<template>
  <div id="content" class="site-content">
    <header>
      <div class="header-content">
        <img
          class="header__logo"
          src="../static/img/logo-wordmark-beta-white.svg"
          alt=""
        >
        <img
          class="header__mockup"
          src="../static/img/sourcery-mockup-no-shadow.png"
          alt=""
        >
        <div class="header__buttons">
          <a
            href="/register"
            class="button button__mobile-block button__lg button__white"
          >
            Sign Up
          </a>
          <nuxt-link
            :to="{ name: 'dashboard' }"
            class="button button__mobile-block button__lg button__outline button__white-outline"
          >
            Log In
          </nuxt-link>
        </div>
        <div class="header__slogan">
          <h1>Your sources, like magic</h1>
          <p>Delivering archival documents straight to your device</p>
        </div>
      </div>
    </header>
    <section id="meet-sourcery">
      <div class="section-container">
        <h1 id="meet" class="color-700">
          Meet Sourcery
        </h1>
        <div class="feature">
          <img
            class="feature-illustration"
            src="../static/img/landing-illustrations/undraw_researching_22gp.svg"
            alt=""
          >
          <div class="feature-desc">
            <h4 class="feature-title">
              Easy document requests
            </h4>
            <p class="feature-text">
              Request a document using just a citation and where
              it’s located.
            </p>
          </div>
        </div>
        <div class="feature feature__text-first">
          <img
            class="feature-illustration"
            src="../static/img/landing-illustrations/undraw_collaborators_prrw.svg"
            alt=""
          >
          <div class="feature-desc">
            <h4 class="feature-title">
              High quality sources
            </h4>
            <p class="feature-text">
              Receive high resolution scans from institutions and
              Sourcery-registered researchers.
            </p>
          </div>
        </div>
        <div class="feature">
          <img
            class="feature-illustration"
            src="../static/img/landing-illustrations/undraw_folder_files_nweq.svg"
            alt=""
          >
          <div class="feature-desc">
            <h4 class="feature-title">
              Streamlining workflows for institutions
            </h4>
            <p class="feature-text">
              Give archival staff and patrons one easy platform
              for requesting and receiving scans.
            </p>
          </div>
        </div>
        <div class="feature feature__text-first">
          <img
            class="feature-illustration"
            src="../static/img/landing-illustrations/undraw_wallet_aym5.svg"
            alt=""
          >
          <div class="feature-desc">
            <h4 class="feature-title">
              Cut the travel fees
            </h4>
            <p class="feature-text">
              Save your wallet from expensive flights and
              transportation.
            </p>
          </div>
        </div>
        <div class="feature">
          <img
            class="feature-illustration"
            src="../static/img/landing-illustrations/undraw_absorbed_in_xahs.svg"
            alt=""
          >
          <div class="feature-desc">
            <h4 class="feature-title">
              Get back to what’s important
            </h4>
            <p class="feature-text">
              Gain efficient, affordable access with Sourcery.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="how-does-sourcery-work">
      <div class="section-container">
        <div class="section-header">
          <img
            class="section-img"
            src="../static/img/landing-illustrations/undraw_faq_rjoy.svg"
            alt=""
          >
          <h1 id="how" ref="how" class="text">
            How does Sourcery work?
          </h1>
        </div>
        <div class="paragraphs">
          <p class="medium">
            When you submit a request, the app finds and notifies
            Sourcery-registered researchers working near the
            repository where your document is located. One of these
            remote researchers will claim the job, call the document
            from the archive, take a picture of it, and
            <span>send it directly to your desktop or mobile
              device</span>.
          </p>
          <img
            src="../static/img/sparkle-circle.svg"
            alt=""
            class="sparkle"
          >
          <p class="text indiv">
            Sourcery is a not-for-profit service that gives
            researchers access to documents that can't be found
            online by paying other researchers to find them. It aims
            to streamline the process that researchers go through by
            providing one simple platform that works at any
            collecting institution in our service area (currently
            New York City, Boston, Washington, DC, and Storrs;
            coming soon to Providence, New Haven, and other cities).
            <span>Just provide the document’s citation information,
              and Sourcery will do the rest.</span>
          </p>
          <img
            src="../static/img/sparkle-circle.svg"
            alt=""
            class="sparkle"
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
        <a
          href="/about"
          class="button button__sm button__outline button__mobile-block button__purple"
        >Learn More</a>
      </div>
    </section>

    <section id="cta">
      <div class="section-container">
        <div class="section-header">
          <img
            src="../static/img/landing-illustrations/undraw_enter_uhqk.svg"
            alt=""
            class="section-img ready-img"
          >
          <h1 id="ready">
            Ready to try Sourcery?
          </h1>
        </div>
        <div class="cta-buttons">
          <nuxt-link
            :to="{ name: 'dashboard' }"
            class="button button___mobile-block button__lg button__outline"
          >
            Log In
          </nuxt-link>
          <a
            href="/register"
            class="button button___mobile-block button__lg button__purple"
          >
            Sign Up
          </a>
        </div>
      </div>
    </section>

    <footer class="footer__light">
      <div class="footer-content">
        <a href="https://sourceryapp.org/">
          <img src="../static/img/sourcery-logo-purple.svg" alt="">
        </a>
        <div class="social-icons">
          <a
            href="https://www.instagram.com/sourcery_app/"
            class="social-icon"
          >
            <img
              src="../static/img/social-icons/instagram.svg"
              alt=""
            >
          </a>
          <a
            href="https://www.facebook.com/SourceryApp"
            class="social-icon"
          >
            <img
              src="../static/img/social-icons/facebook.svg"
              alt=""
            >
          </a>
          <a
            href="https://twitter.com/Sourcery_App"
            class="social-icon"
          >
            <img
              src="../static/img/social-icons/twitter.svg"
              alt=""
            >
          </a>
        </div>
        <p>
          Sourcery is a project of the Corporation for Digital
          Scholarship, a nonprofit organization dedicated to the
          development of software and services for researchers and
          cultural heritage institutions, in partnership with
          Greenhouse Studios | Scholarly Communications Design at
          UConn
        </p>
      </div>
      <cookie-law
        theme="dark-lime"
        message="We use cookies to ensure you get the best experience on our website."
        button-text="OK"
        button-link="/cookies-notice"
      />
    </footer>

    <footer />
  </div>
</template>

<script>
/**
 * Cookie Consent
 * @url https://github.com/apertureless/vue-cookie-law#--vue-cookie-law
 */
import CookieLaw from 'vue-cookie-law'
export default {
    name: 'Home',
    layout: 'landing-beta',
    middleware: null,
    components: { CookieLaw },
    data () {
        return {
            // social: social
        }
    },
    mounted () {},
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
        }
    },
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
    }
}
</script>

<style>
:root {
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
    color: var(--sourcery-900);
}
h1 {
    font-size: 32px;
    line-height: 38px;
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
header {
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
.feature-desc {
    color: var(--sourcery-900);
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
    background: #f2f0f6;
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
}
.paragraphs {
    margin-bottom: 24px;
}
.button {
    transition: transform 100ms ease-in, border-radius 100ms ease-in;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: 600;
    border-radius: 4px;
    text-align: center;
}
.button:hover,
.button:focus {
    transform: scale(1.03);
    border-radius: 8px;
}
.button:active {
    transform: scale(0.98);
}
.button__lg {
    padding-left: 60px;
    padding-right: 60px;
    height: 76px;
    font-size: 24px;
}
.button__sm {
    padding: 12px 24px;
    font-size: 16px;
}
.button__outline {
    border: solid 2px;
}
.button__purple {
    background: var(--sourcery-500);
    color: white;
}
.button__white {
    background: white;
    color: var(--sourcery-900);
}
.button__white-outline {
    color: white;
}
.button__mobile-block {
    display: flex;
    width: 100%;
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
footer {
    width: 100%;
    background: #f2f0f6;
}
.footer-content {
    padding: 48px 24px;
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
    color: #4a3a74;
    line-height: 22px;
}
.footer-content img {
    fill: red;
    width: 100%;
    height: 40px;
}
.social-icons {
    display: flex;
    justify-content: center;
    margin: 12px 0;
}
.social-icons .social-icon {
    transition: transform 100ms ease-in;
    margin-left: 8px;
    margin-right: 8px;
}
.social-icons .social-icon:hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
.social-icons .social-icon img {
    height: 32px;
    width: 32px;
}
@media only screen and (min-width: 600px) {
    header {
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
        color: var(--sourcery-900);
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
    .button__mobile-block {
        width: auto;
        margin: 0 auto;
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
