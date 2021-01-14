<template>
  <div>
    <div class="flex">
      <div class="w-1/12 sm:w-1/6" />
      <div class="w-10/12 sm:w-4/6">
        <a href="/">
          <img src="/img/beta-primary-brian.svg">
        </a>
      </div>
      <div class="w-1/12 sm:w-1/6" />
    </div>
    <main class="w-5/5 p-8 mx-auto sm:w-3/5">
      <section class="shadow ">
        <article class="border-b">
          <div class="border-l-2 border-transparent">
            <header class="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
              <span class="text-grey-darkest font-thin text-xl">
                What is Sourcery?
              </span>
              <div class="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
                <!-- icon by feathericons.com -->
                <svg
                  aria-hidden="true"
                  class=""
                  data-reactid="266"
                  fill="none"
                  height="24"
                  stroke="#606F7B"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewbox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="toggle1"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </header>
            <div :class="open1 ? 'block': 'hidden'">
              <div class="pl-8 pr-8 pb-5 text-grey-darkest">
                <ul class="pl-4">
                  <li class="pb-2">
                    Sourcery aims to improve the systems and technologies whereby researchers access not-yet digitized archival documents. With the Sourcery app installed on a phone or laptop, a researcher seeking a document can simply type the required document’s location information into the Sourcery application and other researchers in place near those documents can retrieve them. Using geolocation services, the app finds Sourcery-registered researchers currently working in and around the repository where the document sits. Using push notifications to their smartphones, Sourcery notifies these remote researchers to let them know a document has been requested. One of these remote researchers (the “Sourcerer”) claims the job, calls the document from the archives, takes a picture of it from within the Sourcery application, and sends it directly to the Sourcery requesting researcher. The requesting researcher pays a fee based on the scope of the request, the number of local Sourcerers available at the time, the urgency, and other variables. The Sourcerer receives the bulk of that fee for their efforts, and Sourcery receives a small percentage to maintain the service.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
        <article class="border-b">
          <div class="border-l-2 border-transparent">
            <header class="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
              <span class="text-grey-darkest font-thin text-xl">
                Why Sourcery?
              </span>
              <div class="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
                <!-- icon by feathericons.com -->
                <svg
                  aria-hidden="true"
                  class=""
                  data-reactid="266"
                  fill="none"
                  height="24"
                  stroke="#606F7B"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewbox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="toggle2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </header>
            <div :class="open2 ? 'block': 'hidden'">
              <div class="pl-8 pr-8 pb-5 text-grey-darkest">
                <ul class="pl-4">
                  <li class="pb-2">
                    Though libraries and archives have built vast collections of digitized primary source materials over the last few decades, an even greater volume remains undigitized, available only through a trip to the archives or through in-house reproduction services. Currently, when a researcher needs a document that has not already been digitized and made accessible on the web, the available options are limited. Perhaps the most commonly chosen option is to plan a research trip to the remote archive to see the document in person, despite all the obvious disadvantages of time, planning, and expense. Another option is to contact the repository where the document is held to ask for the item to be digitized and sent directly. However, not all archives offer these services. Even when they do, it can often be difficult to find information about placing a request on an archive’s website. All archives differ in their processes, so it can take time to figure out the precise one for a given repository. Costs and delivery times vary widely. Some archives can provide access in a matter of hours or days for a nominal fee or at no cost. Others take weeks or months and charge as much as hundreds of dollars per document. At a minimum, the process of getting access to remote archival materials is a pain for researchers. In many cases the costs and hassle are prohibitive, and researchers choose simply to do without.
                  </li>
                  <li class="pb-2">
                    Sourcery is designed expressly to remedy obstacles related to time, expense, and unclear processes for requesting and receiving documents. By precluding the need to pay for travel and lodging, Sourcery promises to dramatically reduce the cost of acquiring scans of documents. Similarly, Sourcery promises to significantly reduce the time it takes to acquire a document from months to mere hours in many cases. Sourcerers, who are paid a fee for each transaction, will have an incentive to rapidly return high quality images in order to continue attracting ressearchers. In these ways, the Sourcery app will connect individual researchers around the globe with on-site researchers at some of the world’s richest collections of primary source material at significantly reduced time, expense, and hassle. By providing one, simple platform that works across a range of institutions, Sourcery streamlines the document retrieval and reproduction process both for individual researchers and collecting institutions.
                  </li>
                  <li class="pb-2">
                    The work here, however, is not just about saving researchers and collecting institutions time, money, and hassle. Ultimately, Sourcery's work of connecting researchers to documents more effectively is about fulfilling the promise of citation. Citation is meant not only to provide evidence for the truth of claims made by authors, but to connect readers to resources that may be useful in enhancing their own knowledge and research. By connecting readers to the remote resources they find in notes and bibliographies, Sourcery will help fulfill the promise of the scholarly communication apparatus of citation built up by the academic community over centuries.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
        <article class="border-b">
          <div class="border-l-2 border-transparent">
            <header class="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
              <span class="text-grey-darkest font-thin text-xl">
                Who is it For?
              </span>
              <div class="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
                <!-- icon by feathericons.com -->
                <svg
                  aria-hidden="true"
                  class=""
                  data-reactid="266"
                  fill="none"
                  height="24"
                  stroke="#606F7B"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewbox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="toggle3"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </header>
            <div :class="open3 ? 'block': 'hidden'">
              <div class="pl-8 pr-8 pb-5 text-grey-darkest">
                <ul class="pl-4">
                  <li class="pb-2">
                    Humanities scholars are, of course, a natural audience for this service, but they are not the only ones who need remote access to the vast majority of archival documents that have not, and may never be, digitized. Other audiences include lawyers needing access to documents in court houses, amateur genealogists looking for parish records, scientists looking for historical data sets, and civil engineers looking for municipal planning documents. For these and other researchers, Sourcery will provide a streamlined and consistent experience for requesting documents from anywhere, thereby reducing time and hassle.
                  </li>
                  <li class="pb-2">
                    While third-parties like graduate students are most likely to become Sourcerers, we expect that repositories themselves may ultimately constitute Sourcery's main Sorcerer base. Professional librarians and archivists employed by institutions will often be best positioned to find and serve documents from their collections quickly and expertly. Indeed, institutional adoption of Sourcery should allow repositories themselves a chance to better serve their patrons, expand their geographical reach, and streamline their document scanning and provision workflows. Over time, as libraries and archives discover that Sourcery can help them identify new audiences for their collections, meet their remote patrons’ needs more effectively than their existing systems, and provide a new source of revenue, we expect that Sourcery will not only to become an end-user facing application but also a core piece of the library field’s technology infrastructure.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
        <article class="border-b">
          <div class="border-l-2 border-transparent">
            <header class="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
              <span class="text-grey-darkest font-thin text-xl">
                Who Are We?
              </span>
              <div class="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
                <!-- icon by feathericons.com -->
                <svg
                  aria-hidden="true"
                  class=""
                  data-reactid="266"
                  fill="none"
                  height="24"
                  stroke="#606F7B"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewbox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="toggle4"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </header>
            <div :class="open4 ? 'block': 'hidden'">
              <div class="pl-8 pr-8 pb-5 text-grey-darkest">
                <ul class="pl-4">
                  <li class="pb-2">
                    Sourcery is a project of the <a href="http://digitalscholar.org/"> Corporation for Digital Scholarship</a>, a nonprofit organization dedicated to the development of software and services for researchers and cultural heritage institutions, in partnership with <a href="https://greenhousestudios.uconn.edu/"> Greenhouse Studios | Scholarly Communications Design</a> at the University of Connecticut.
                  </li><li class="pb-2">
                    The Sourcery leadership team consists of experienced professionals drawn from the fields that Sourcery draws on: digital humanities tool building; web and mobile application design and development; and digital archives. Project Director Tom Scheinfeldt is Associate Professor of Digital Humanities and Director of Greenhouse Studios. Scheinfeldt has played a leadership role in the development of several widely-used research and archives software packages, including, most notably, Omeka. Development Lead Brian Daley is Assistant Professor in Residence in the Department of Digital Media and Design, where he brings nearly 20 years’ experience creating accessible web and mobile platforms for teaching and scholarship. Greg Colati and Sara Sikes are the projects library and archives leads. Colati is Associate University Librarian for Archives, Special Collections, and Digital Curation and a recognized authority on digital archives tools and processes. Sikes Associate Director of Greenhouse Studios with expertise spanning museums, academic publishing, documentary editing, digital humanities, and public history. Project Manager and Outreach Coordinator Wes Hamrick and Lead Designer Brooke Foti Gemmell bring broad experience in digital humanities research methods and project management and web and graphic design respectively.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
        <article class="border-b">
          <div class="border-l-2 border-transparent">
            <header class="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
              <span class="text-grey-darkest font-thin text-xl">
                Where Does Sourcery Fit?
              </span>
              <div class="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
                <!-- icon by feathericons.com -->
                <svg
                  aria-hidden="true"
                  class=""
                  data-reactid="266"
                  fill="none"
                  height="24"
                  stroke="#606F7B"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewbox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="toggle5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </header>
            <div :class="open5 ? 'block': 'hidden'">
              <div class="pl-8 pr-8 pb-5 text-grey-darkest">
                <ul class="pl-4">
                  <li class="pb-2">
                    Sourcery exists at the confluence of three currently separate streams of computer software development: library and archives document retrieval services which Sourcery aims to improve; research software packages which Sourcery aims to complement; and “sharing economy” mobile applications which Sourcery aims to emulate.
                  </li>
                  <li class="pb-2">
                    Sourcery aims to improve the existing systems and technologies whereby patrons access undigitized documents from remote collecting institutions, which currently employ a haphazard combination of methods for remote access. Many libraries and archives offer document reproduction and scan-on-demand services, often for a nominal fee, and a handful offer inter-library loan services for special collections materials. However, the process for requesting scans varies from institution to institution, and it is not always clear or obvious to the remote researcher how to find information about submitting requests or whom to contact.
                  </li>
                  <li class="pb-2">
                    Along with the inconvenience of learning the request process for each individual archive, scholars also frequently contend with slow turnaround times. On-demand reproduction services are typically considered adjunct to the core functions of the archive and have limited resources. Sourcery lets individual researchers find and pay for someone nearby who has the resources—the time and wherewithal—to help them.
                  </li>
                  <li class="pb-2">
                    Building image collections represents only one of many stages of the scholarly research process. Sourcery will align with scholars’ existing research workflows and encourage responsible scholarly practices. A 2012 Ithaka S+R report on the changing research practices of historians also advised that scholars need to “seamlessly integrate tools for organizing, annotating, and analyzing primary source materials into their workflows.” Scholars have increasingly adopted citation and document management systems to keep track of and enhance their personal research collections. Where possible, Sourcery will aim to complement and become interoperable with the constellation of common annotation, organization, and analysis tools and systems, such as Zotero, Mendeley, RefWorks, and Tropy. To this end, we have already had preliminary conversations with the project directors for Tropy and Zotero about interoperability with Sourcery and about the potential for developing an integration tool kit for these complementary applications. (The Corporation for Digital Scholarship, which supports Tropy, Omeka, and Zotero, will also support operations of Sourcery, thus laying the groundwork for this kind of close collaboration.)
                  </li>
                  <li class="pb-2">
                    Mobile technology provides means of connecting people with local needs to people with local capacity. “Sharing economy” applications like Uber, AirBnB, and Instacart have demonstrated the promise of mobile technology to connect people who need a ride to people with local capacity (i.e. a car) or people who need groceries with people with local capacity (i.e. time to do the shopping). The connection in these applications is made based on geo-location data from mobile phones. The cost per transaction is determined according to an algorithm tuned to local conditions. In Uber’s case, for example, the pricing algorithm determines the rider’s cost based on variables such as the distance the rider needs to travel, the time of day, traffic conditions on the proposed route, and the proximity and number of available drivers. The growing popularity of these sharing economy applications demonstrates that individuals are sometimes better equipped or better incentivized than large organizations to meet the needs of other individuals. Recognizing the important questions these “gig economy” apps raise for issues of labor equity and responsible regulation, Sourcery nevertheless looks to apply the lessons (positive and negative) and technologies employed by these companies to address needs among library users and libraries themselves.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
        <article class="border-b">
          <div class="border-l-2 border-transparent">
            <header class="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
              <span class="text-grey-darkest font-thin text-xl">
                Where is Sourcery Available?
              </span>
              <div class="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
                <!-- icon by feathericons.com -->
                <svg
                  aria-hidden="true"
                  class=""
                  data-reactid="266"
                  fill="none"
                  height="24"
                  stroke="#606F7B"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewbox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="toggle6"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </header>
            <div :class="open6 ? 'block': 'hidden'">
              <div class="pl-8 pr-8 pb-5 text-grey-darkest">
                <ul class="pl-4">
                  <li class="pb-2">
                    Sourcery is currently serving documents from archives in the Boston and New York metro areas. Our expansion plans include Washington, DC, Chicago, Philadelphia and other cities beginning in 2020.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
    <div class="container" style="min-height: auto">
      <a
        id="subscribe"
        href="/"
        class="inline-block bg-transparent hover:bg-purple-500 text-purple-500 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded"
      >Sign Up Now!</a>
    </div>
    <div class="container" style="min-height: auto;">
      <div style="padding-top: 1%;">
        <a class="fa fa-instagram" :href="$this.$utils.socialLinks.instagram" />
        <a class="fa fa-twitter" :href="$this.$utils.socialLinks.twitter" />
        <a class="fa fa-facebook" :href="$this.$utils.socialLinks.facebook" />
      </div>
    </div>
    <hr>
    <div class="text-center" style="padding-top: 1%;">
      <p class="text-sm  pb-6 text-gray-600">
        Sourcery is a project of the <a href="http://digitalscholar.org/">Corporation for Digital Scholarship</a>,
        a nonprofit organization dedicated to the development of software and services for researchers and cultural
        heritage institutions, in partnership with <a href="https://greenhousestudios.uconn.edu/">Greenhouse Studios
          | Scholarly Communications Design</a> at UConn
      </p>
    </div>
  </div>
</template>

<script>
export default {
    layout: 'landing-signup',
    data () {
        return {
            open1: false,
            open2: false,
            open3: false,
            open4: false,
            open5: false,
            open6: false
        }
    },
    methods: {
        toggle1 () {
            this.open1 = !this.open1
        },
        toggle2 () {
            this.open2 = !this.open2
        },
        toggle3 () {
            this.open3 = !this.open3
        },
        toggle4 () {
            this.open4 = !this.open4
        },
        toggle5 () {
            this.open5 = !this.open5
        },
        toggle6 () {
            this.open6 = !this.open6
        }
    }
}
</script>

<style scoped>
.flex {
    flex: inherit;
}
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
    color: white;
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
