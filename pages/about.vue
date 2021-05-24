<template>
  <div class="page-container">
    <div id="content-wrap">
      <v-app-bar
        :color="$vuetify.theme.dark ? '#121212' : 'white'"
        max-height="84px"
        elevate-on-scroll
        app
      >
        <v-layout>
          <v-spacer />
          <v-app-bar-title>
            <NuxtLink id="wordmark-link" to="/">
              <img id="logo" :src="$vuetify.theme.dark ? '/img/sourcery-wordmark-dark.svg' : '/img/sourcery-wordmark.svg'" alt="Sourcery Logo">
            </NuxtLink>
          </v-app-bar-title>
          <v-spacer />
        </v-layout>
      </v-app-bar>
      <v-layout style="margin-top: 84px">
        <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
          <h1 class="mb-4">
            About
          </h1>
          <v-expansion-panels flat>
            <v-expansion-panel
              v-for="(item,i) in items"
              :key="i"
            >
              <v-expansion-panel-header class="text-h6">
                {{ item.question }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="mt-2">
                <div v-if="item.answer">
                  {{ item.answer }}
                </div>
                <!-- who are we -->
                <div v-if="item.answer_link">
                  {{ item.answer_link }}
                  <a href="https://digitalscholar.org/">{{ item.answer_link01 }}</a>
                  {{ item.answer_link02 }}
                  <a href="https://greenhousestudios.uconn.edu/">{{ item.answer_link03 }}</a>
                  {{ item.answer_link04 }}
                </div>
                <!-- when is sourcery coming -->
                <div v-if="item.answer_link1">
                  {{ item.answer_link1 }} <a href="https://sourceryapp.org/">{{ item.answer_link2 }}</a> {{ item.answer_link3 }}
                </div>
                <div v-if="item.answer2">
                  <br>
                  {{ item.answer2 }}
                </div>
                <div v-if="item.answer3">
                  <br>
                  {{ item.answer3 }}
                </div>
                <div v-if="item.answer4">
                  <br>
                  {{ item.answer4 }}
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-flex>
      </v-layout>
    </div>
    <sourcery-footer id="footer" />
  </div>
</template>

<script>
/**
 * Cookie Consent
 * @url https://github.com/apertureless/vue-cookie-law#--vue-cookie-law
 */
import Footer from '../components/footer'

export default {
    name: 'About',
    components: {
        'sourcery-footer': Footer
    },
    layout: 'landing-beta',
    middleware: null,
    data () {
        return {
            items: [
                {
                    question: 'What is Sourcery?',
                    answer: 'Sourcery aims to improve the systems and technologies whereby researchers access not-yet digitized archival documents. Using the Sourcery app, a researcher seeking a document can simply select a participating institution, enter in the citation information and desired number of pages, and the request will be routed directly to the repository. Some institutions charge a fee based on the scope of the request, while other institutions offer requests free of charge. When a request is fulfilled, the app will notify the researcher via email and send the scans directly to the user’s Sourcery account.',
                    answer2: 'For researchers, it supplies one terminal for them to place all of their document requests across multiple institutions.',
                    answer3: 'For institutions, it supplies a streamlined scan request workflow; a single log-in and interface accessible from any device; seamless, efficient, secure payments (for institutions that charge fees); and aggregated, anonymized data on collections use, geographic location of remote researchers, etc.'
                },
                {
                    question: 'Why Sourcery?',
                    answer: 'Though libraries and archives have built vast collections of digitized primary source materials over the last few decades, an even greater volume remains undigitized, available only through a trip to the archives or through in-house reproduction services. Currently, when a researcher needs a document that has not already been digitized and made accessible on the web, the available options are limited. Perhaps the most commonly chosen option is to plan a research trip to the remote archive to see the document in person, despite all the obvious disadvantages of time, planning, and expense. Another option is to contact the repository where the document is held to ask for the item to be digitized and sent directly. However, not all archives offer these services. The process can be challenging for both researchers and archivists for reasons that are often out of their hands, such as being under-resourced in time, technology, and staffing. All archives differ in their workflows, so costs and delivery times vary widely. Some archives can provide access in a matter of hours or days for a nominal fee or at no cost. Others take weeks or months and charge as much as hundreds of dollars per document. In many cases the costs and hassle are prohibitive, and researchers choose simply to do without.',
                    answer2: 'Sourcery is designed expressly to remedy obstacles related to time, expense, and complicated processes for submitting and fulfilling scan requests. By precluding the need to pay for travel and lodging, Sourcery promises to dramatically reduce the cost and environmental impact of acquiring scans of documents. Similarly, Sourcery promises to significantly reduce the time it takes to place and process requests to mere hours in many cases. Institutions will be able to rapidly return high quality images in order to better connect their patrons to their collections. In these ways, the Sourcery app will connect individual researchers around the globe with some of the world’s richest collections of primary source material at significantly reduced time, expense, and hassle. By providing one, simple platform that works across a range of institutions, Sourcery streamlines the document retrieval and reproduction process both for individual researchers and collecting institutions.',
                    answer3: 'The work here, however, is not just about saving researchers and collecting institutions time, money, and hassle. Ultimately, Sourcery\'s work of connecting researchers to documents more effectively is about fulfilling the promise of citation. Citation is meant not only to provide evidence for the truth of claims made by authors, but to connect readers to resources that may be useful in enhancing their own knowledge and research. By connecting readers to the remote resources they find in notes and bibliographies, Sourcery will help fulfill the promise of the scholarly communication apparatus of citation built up by the academic community over centuries.'
                },
                {
                    question: 'Who is it for?',
                    answer: 'Humanities scholars are, of course, a natural audience for this service, but they are not the only ones who need remote access to the vast majority of archival documents that have not, and may never be, digitized. Future audiences could include lawyers needing access to documents in court houses, amateur genealogists looking for parish records, scientists looking for historical data sets, and civil engineers looking for municipal planning documents. For these and other researchers, Sourcery will provide a streamlined and consistent experience for requesting documents from anywhere, thereby reducing time and hassle.',
                    answer2: 'Professional librarians and archivists employed by institutions will often be best positioned to find and serve documents from their collections quickly and expertly. Indeed, institutional adoption of Sourcery should allow repositories themselves a chance to better serve their patrons, expand their geographical reach, and streamline their document scanning and provision workflows. Over time, as libraries and archives discover that Sourcery can help them identify new audiences for their collections, meet their remote patrons’ needs more effectively than their existing systems, and provide a new source of revenue, we expect that Sourcery will not only to become an end-user facing application but also a core piece of the library field’s technology infrastructure.'
                },
                {
                    question: 'Who are we?',

                    answer_link: 'Sourcery is a project of the',
                    answer_link01: 'Corporation for Digital Scholarship',
                    answer_link02: ', a nonprofit organization dedicated to the development of software and services for researchers and cultural heritage institutions, in partnership with ',
                    answer_link03: 'Greenhouse Studios | Scholarly Communications Design',
                    answer_link04: 'at the University of Connecticut.',
                    answer2: 'The Sourcery leadership team consists of experienced professionals drawn from the fields that Sourcery draws on: digital humanities tool building; web and mobile application design and development; and digital archives. Project Director Tom Scheinfeldt is Associate Professor of Digital Humanities and Director of Greenhouse Studios. Scheinfeldt has played a leadership role in the development of several widely-used research and archives software packages, including, most notably, Omeka. Development Lead Brian Daley is Assistant Professor in Residence in the Department of Digital Media and Design, where he brings nearly 20 years’ experience creating accessible web and mobile platforms for teaching and scholarship. Greg Colati and Sara Sikes are the project’s archives and library leads respectively. Colati, the Digital Preservation Repository Program Director at the UConn Library and Director of the Connecticut Digital Archive (CTDA), is a recognized authority on digital archives tools and processes. Sikes is the Associate Director of Greenhouse Studios, with expertise spanning museums, academic publishing, documentary editing, digital humanities, and public history. Project Manager and Outreach Coordinator Wes Hamrick, Outreach Assistant Garrett McComas, and Lead Designer Brooke Foti Gemmell bring broad experience in digital humanities research methods and project management and web and graphic design respectively.',
                    answer3: 'In partnership with Northeastern University Library, Sourcery has received significant support from the Andrew W. Mellon Foundation.'
                },
                {
                    question: 'Where does Sourcery fit?',
                    answer: 'Sourcery exists at the confluence of two currently separate streams of computer software development: library and archives document retrieval services which Sourcery aims to improve and research software packages which Sourcery aims to complement.',
                    answer2: 'Sourcery aims to improve the existing systems and technologies whereby patrons access undigitized documents from remote collecting institutions, which currently employ a mixed bag of methods for remote access. Many libraries and archives offer document reproduction and scan-on-demand services, often for a nominal fee, and a handful offer inter-library loan services for special collections materials. However, the process for requesting scans varies from institution to institution, and it is not always clear or obvious to the remote researcher how to find information about submitting requests or whom to contact.',
                    answer3: 'Along with the inconvenience of learning the request process for each individual archive, turnaround times can vary widely.  On-demand reproduction services are typically considered adjunct to the core functions of the archive, and often have limited resources and staffing to support them. Sourcery allows individual researchers to easily submit requests directly to any participating repository through one simple platform. Likewise, Sourcery offers a streamlined interface for institutions to easily and efficiently receive and fulfill requests.',
                    answer4: 'Building image collections represents only one of many stages of the scholarly research process. Sourcery will align with scholars’ existing research workflows and encourage responsible scholarly practices. A 2012 Ithaka S+R report on the changing research practices of historians also advised that scholars need to “seamlessly integrate tools for organizing, annotating, and analyzing primary source materials into their workflows.” Scholars have increasingly adopted citation and document management systems to keep track of and enhance their personal research collections. Where possible, Sourcery will aim to complement and become interoperable with the constellation of common annotation, organization, and analysis tools and systems, such as Zotero, Mendeley, RefWorks, and Tropy. To this end, we have already had preliminary conversations with the project directors for Tropy and Zotero about interoperability with Sourcery and about the potential for developing an integration tool kit for these complementary applications. (The Corporation for Digital Scholarship, which supports Tropy, Omeka, and Zotero, also supports operations of Sourcery, thus laying the groundwork for this kind of close collaboration.)'
                },
                {
                    question: 'Where is Sourcery available?',
                    answer: 'We are currently testing the enterprise version with a handful of collecting institutions. We plan to open the beta to allow users to place requests from select institutions later in 2021. Follow the Sourcery Twitter account for the announcement of the Sourcery Enterprise beta launch date.'
                },
                {
                    question: 'Sourcery Peer-to-Peer',
                    answer: 'In addition to the enterprise version, the Sourcery app will eventually relaunch its peer-to-peer model for remote access to archives and special collections. Mobile technology provides means of connecting people with local needs to people with local capacity. “Sharing economy” applications like Uber, AirBnB, and Instacart have demonstrated the promise of mobile technology to connect people who need a ride to people with local capacity (i.e. a car) or people who need groceries with people with local capacity (i.e. time to do the shopping). The connection in these applications is made based on geo-location data from mobile phones. The cost per transaction is determined according to an algorithm tuned to local conditions. In Uber’s case, for example, the pricing algorithm determines the rider’s cost based on variables such as the distance the rider needs to travel, the time of day, traffic conditions on the proposed route, and the proximity and number of available drivers. ',
                    answer2: 'The growing popularity of these sharing economy applications demonstrates that individuals are sometimes better equipped or better incentivized than large organizations to meet the needs of other individuals. Recognizing the important questions these “gig economy” apps raise for issues of labor equity and responsible regulation, Sourcery nevertheless looks to apply the lessons (positive and negative) and technologies employed by these companies to address needs among library users and libraries themselves. The peer-to-peer model of Sourcery aims to provide fair compensation for individuals fulfilling document requests for other individuals. If a participating institution is not able to fulfill a Sourcery request on its own, the request can then be fulfilled by “Sourcerers” who are near the repository. The Sourcerer takes on the request and scans the document. Payment is processed securely through Stripe. With the peer-to-peer model, Sourcery hopes to formalize document recovery work often done for free by graduate students and other researchers. Our aim is complement work already being done in archives and special collections and help facilitate the timely fulfillment of document requests.'
                }
            ]
            // social: social
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
    },
    mounted () {},
    methods: {
    }
}
</script>

<style>
.page-container {
  position: relative;
  min-height: 100vh;
}
#content-wrap {
  padding-bottom: 160px;    /* Footer height */
}
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
