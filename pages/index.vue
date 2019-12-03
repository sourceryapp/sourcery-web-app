<template>
  <div class="container">
    <div>
      <div class="flex">
        <div class="w-1/12 sm:w-1/12"></div>
        <div class="w-full sm:w-full">
          <a href="/">
            <img src="/img/beta-primary-brian.svg">
          </a>
        </div>
      </div>
      <div>
      <div>
        <h2 class="subtitle">
          <div class="flex">
            <div class="lg:w-1/5 sm:w-0/5"></div>
            <div class="lg:w-3/5 sm:w-5/5">
              <p>Introducing Sourcery, connecting researchers and archives.</p>
              <div class="video-responsive">
                <iframe class="inline" width="560" height="315" src="https://www.youtube-nocookie.com/embed/-PG6UeDhgu8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
            <div class="lg:w-1/5 h-12 sm:w-0/5"></div>
          </div>
        </h2>
        <h4 class="betaText">
          <div class="flex">
            <div class="lg:w-1/5 sm:w-0/5"></div>
            <div class="lg:w-3/5 sm:w-5/5">
              Sign up for our beta! Stay up to date with Sourcery news and updates, and have instant access upon release.
            </div>
            <div class="w-1/5 h-12"></div>
          </div>
        </h4>
        <!-- Begin Mailchimp Signup Form -->
        <div class="lg:flex sm:">
          <div class="lg:w-2/5 h-12 sm:"></div>
            <div class="lg:w-1/5 sm:">
              <link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css">
              <div id="mc_embed_signup">
              <form action="https://tube.us18.list-manage.com/subscribe/post?u=df67d057bef5a3ea1c8cd0339&amp;id=6d06cd4fb2" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate m-0 p-0" target="_blank" novalidate>
                  <div id="mc_embed_signup_scroll">
              <div class="mc-field-group">
                <div class="formText">
                  <label for="mce-FNAME">First Name </label>
                  <input type="text" value="" name="FNAME" class="" id="mce-FNAME">
                </div>
              </div>
              <div class="mc-field-group">
                <div class="formText">
                  <label for="mce-LNAME">Last Name </label>
                  <input type="text" value="" name="LNAME" class="" id="mce-LNAME">
                </div>
              </div>
              <div class="mc-field-group">
                <div class="formText">
                  <label for="mce-EMAIL">Email Address  <span class="asterisk">*</span>
                  </label>
                  <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
                </div>
              </div>
              <div class="mc-field-group">
                <div class="formText">
                  <label for="mce-INSTITUT">Institution </label>
                  <input type="text" value="" name="INSTITUT" class="" id="mce-INSTITUT">
                </div>
              </div>
                <div id="mce-responses" class="clear">
                  <div class="response" id="mce-error-response" style="display:none"></div>
                  <div class="response" id="mce-success-response" style="display:none"></div>
                </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                  <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_df67d057bef5a3ea1c8cd0339_6d06cd4fb2" tabindex="-1" value=""></div>
                  <div class="flex flex-row justify-center">
                    <input type="submit" value="Subscribe" name="subscribe" id="subscribe"  class="bg-purple-500 hover:bg-white text-white font-semibold hover:text-purple-500 py-2 px-4 border bborder-purple-500 rounded">
                  </div>
                </div>
              </form>
            </div>
            <script type='text/javascript' src='https://s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script>
            <script type='text/javascript'></script>
            <!--End mc_embed_signup-->
            </div>
          <div class="w-1/5 h-12"></div>
        </div>
        <div class="links mt-8">
          <!-- <a
            href="https://greenhousestudios.uconn.edu/"
            target="_blank"
            class="bg-transparent hover:bg-purple-500 text-purple-500 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded"
          >Greenhouse Studios</a> -->
          <a
            href="/about"
            id="learn-more"
            class="inline-block bg-transparent hover:bg-purple-500 text-purple-500 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded"
          >Learn More</a>
        </div>
      </div>
      <div class="pt-6 pb-6">
        <a class="fa fa-instagram" :href="social.instagram"></a>
        <a class="fa fa-twitter" :href="social.twitter"></a>
        <a class="fa fa-facebook" :href="social.facebook"></a>

      </div>
      </div>
      <hr>
      <div>
        <p class="text-sm  pb-6 text-gray-600">Sourcery is a project of the <a href="http://digitalscholar.org/">Corporation for Digital Scholarship</a>,
        a nonprofit organization dedicated to the development of software and services for researchers and cultural
        heritage institutions, in partnership with <a href="https://greenhousestudios.uconn.edu/">Greenhouse Studios
        | Scholarly Communications Design</a> at UConn</p>
      </div>
    </div>
  </div>
</template>



<script>
import social from "~/modules/social.js";
export default {
  name: 'home',
  layout: 'landing-signup',
  middleware: null,
  data: function() {
    return {
        social: social
    }
  },
  mounted: function(){
    /**
     * Fix for jQuery errors
     */
    (function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[0]='EMAIL';ftypes[0]='email';fnames[6]='INSTITUT';ftypes[6]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';fnames[5]='BIRTHDAY';ftypes[5]='birthday';fnames[7]='ZIP';ftypes[7]='text';}(window.jQuery));
    var $mcj = window.jQuery;

  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/

img {
  max-width: 100%;
  height: auto;
}

#mc_embed_signup form {
  padding: .5em !important;
}

.mc-field-group {
  width: 100% !important;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size:calc(20px + 1.5vw);
  color: #526488;
  word-spacing: 5px;
  padding-top: calc(25px + .5vw);
}

.betaText {
  font-weight: 300;
  font-size: 20px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: calc(10px + .5vw);
  padding-top: 3%;
}

.links {
  padding-top: 1%;
}

.formText {
  color: #526488;
}


.video-responsive{
    overflow:hidden;
    padding-bottom:56.25%;
    position:relative;
    height:0;
}
.video-responsive iframe{
    left:0;
    top:0;
    height:100%;
    width:100%;
    position:absolute;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.fa {
  width: 55px;
  height: 55px;
  display: inline-flex !important;
  border-radius: 10%;
  font-size: 1.5em !important;
}

.fa:before {
  margin:auto;
}

/* Add a hover effect if you want */
.fa:hover {
  opacity: 0.7;
}

/* Set a specific color for each brand */

/* Facebook */
.fa-instagram {
  background: #125688;
  color: white;
}

/* Twitter */
.fa-twitter {
  background: #55ACEE;
  color: white;
}

.fa-facebook {
  background: #3B5998;
  color: white;
}

#subscribe {
    background-color: #654ea3;
    border-color: #654ea3;

}
#subscribe:hover {
    color: #654ea3;
    background-color: white;
    border-color: #654ea3;
}

#learn-more {
    color: #654ea3;
    background-color: white;
    border-color: #654ea3;
}
#learn-more:hover {
   background-color: #654ea3;
   color: white;
}
</style>
