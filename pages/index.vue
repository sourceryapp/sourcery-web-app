<template>
	<div id="content" class="site-content">

	<header>
		<img src="/img/beta-primary-brian.svg" alt="Sourcery Logo" id="logo">
		<p id="subhead">Your sources, like magic</p>
	</header>
	<div id="section3">
		<div class="video-responsive">
			<iframe width="560" height="315" src="https://www.youtube.com/embed/-PG6UeDhgu8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
		</div>
		<aside>
			<p class="text">
				Save the time and cost. Conjure your sources with Sourcery instead!
			</p>
		</aside>
	</div><!--section3-->
	<a href="/register"><button class="purplebutton" id="button1">Join the Beta</button></a>

	<div id="section1">
	<div id="section1top">
		<img src="/img/plane.png" alt="plane" id="plane">
		<p id="intro" class="text">Skip the planes, trains, and automobiles...</p>
		<img src="/img/car.png" alt="car" id="car">
	</div><!--section1top-->
	<div id="section1bottom">
		<img src="/img/bus.png" alt="bus" id="bus">
		<aside>
			<p class="text" id="intro2">...and have your documents delivered to you instead.</p>
			<button class="purplebutton" id="button2" type="button" @click="smoothScroll($refs.how)">Learn More</button>
		</aside>
	</div><!--section1bottom-->
	</div><!--section1-->

	<div id="section2">
		<div id="meet">
			<h1 class="text">Meet Sourcery</h1>
			<h5 class="text">Delivering archival documents straight to your device</h5>
			<img src="/img/transfer.png" alt="phone outline">
			<ul class="text">
				<li>Request a document using a citation</li>
				<li>Receive quality scans from Sourcery-registered researchers</li>
				<li>Cut the travel fees</li>
				<li>Gain efficient, affordable access with <strong>Sourcery</strong></li>
			</ul>
			<button class="purplebutton" id="button3" type="button" @click="smoothScroll($refs.how)">Learn More</button>
		</div> <!--meet-->
	</div><!--section2-->


	<div id="section4">
			<h1 class="text" id="how" ref="how">How does Sourcery work?</h1>
		<div id="paragraphs">
		<p class="text indiv">Sourcery gives researchers access to documents that can't be found online. It aims to streamline the process that researchers go through by providing one simple platform that works at any collecting institution in our service area (New York City, Boston, and Storrs). <span>Just provide the document’s citation information, and Sourcery will do the rest.</span></p>
		<p class="text indiv">When you submit a request, the app finds and notifies Sourcery-registered researchers working near the repository where your document is located. One of these remote researchers will claim the job, call the document from the archive, take a picture of it, and <span>send it directly to your desktop or mobile device</span>.</p>
		<p class="text indiv">Sourcery emerges from the design process of <span><a href="https://greenhousestudios.uconn.edu/" class="partnerlink">Greenhouse Studios</a></span> and from the project team’s past work and ongoing interests in research software for the humanities. Greenhouse Studios, an incubator for digital scholarship at the University of Connecticut, is a shared initiative of the <a href="https://lib.uconn.edu/" class="partnerlink">UConn Library</a>, <a href="https://sfa.uconn.edu/" class="partnerlink">School of Fine Arts</a>, and the <a href="https://clas.uconn.edu/" class="partnerlink">College of Liberal Arts and Sciences</a>. Sourcery is a project of the <a href="https://digitalscholar.org/" class="partnerlink"> Corporation for Digital Scholarship</a>, a not-for-profit organization.

</p>
		</div><!--paragraphs-->
	</div><!--section4-->

	<footer>
			<a href="https://greenhousestudios.uconn.edu/"><img src="/img/gslogoblack.jpg"></a>
			<div id="links">
				<a href="/register"><button class="purplebutton" id="button5">Join the Beta</button></a>
				<a href="mailto:support@sourceryapp.org"><button class="purplebutton" id="button6">Contact Us</button></a>
			</div><!--links-->

            <cookie-law
            theme="dark-lime"
            message="This website uses cookies to ensure you get the best experience on our website."
            buttonText="OK"
            ></cookie-law>
		</footer>

	</div>
</template>



<script>
/**
 * Cookie Consent
 * @url https://github.com/apertureless/vue-cookie-law#--vue-cookie-law
 */
import CookieLaw from 'vue-cookie-law'
export default {
  name: 'home',
  layout: 'landing-beta',
  middleware: null,
  data: function() {
    return {
        // social: social
    }
  },
  components: { CookieLaw },
  methods: {
    smoothScroll: function(target) {
        var scrollContainer = target;
        do { //find scroll container
            scrollContainer = scrollContainer.parentNode;
            if (!scrollContainer) return;
            scrollContainer.scrollTop += 1;
        } while (scrollContainer.scrollTop == 0);

        var targetY = 0;
        do { //find the top of target relatively to the container
            if (target == scrollContainer) break;
            targetY += target.offsetTop;
        } while (target = target.offsetParent);

        scroll = function(c, a, b, i) {
            i++; if (i > 30) return;
            c.scrollTop = a + (b - a) / 30 * i;
            setTimeout(function(){ scroll(c, a, b, i); }, 20);
        }
        // start scrolling
        scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
    }
  },
  mounted: function(){


  }
}
</script>

<style>
body{
	margin: 0;
}

header{
	display: flex;
	flex-direction: column;
}

button:focus{
	outline: 0;
}

a{
	text-decoration: none;
}


#arrow{
	display: none;
}

.video-responsive{
	overflow: hidden;
	padding-bottom: 41.25%;
	width: 74%;
	position: relative;
	height: 0;
	margin: 0 auto;
}

.video-responsive iframe{
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	position: absolute;
}


#logo{
	width: 90%;
	margin: 0 auto;
	margin-top: 5%;
}


#subhead{
	text-align: center;
	width: 60%;
	font-size: 20px;
	margin: 0 auto;
	margin-top: 3%;
	font-family: "Barlow", sans-serif;
	color: #6c6c6c;
}

.purplebutton{
	background-color: #654fa1;
	font-family: "Barlow", sans-serif;
	color: white;
	border-radius: 15px;
	border: none;
	font-size: 20px;
	box-sizing: border-box;
	display: block;
	box-shadow: grey 3px 3px 6px 0px;
	transition: box-shadow, transform;
	transition-duration: .5s;
}

.purplebutton:hover{
	transform: scale(1.1);
	box-shadow: #a0a0a0a6 1px 4px 20px 3px;
}

#button1{
	margin: 0 auto;
	margin-top: 10%;
	width: 50%;
	padding: 20px 30px;
	max-width: 200px;
}

.text{
	font-family: "Barlow", sans-serif;
	color: #6c6c6c;
	text-align: center;
}

span{
	font-weight: 400;
}

.indiv{
	text-align: center;
	text-indent: 0px
}


#section1top{
	margin-top: 20vw;
	display: flex;
	flex-direction: row;
	font-size: 16px;
}

#section1top p{
	width: 50%;
	font-weight: 500;
}

#section1top #plane{
	width: 30%;
	align-self: flex-start;
	position: relative;
	bottom: 30px;
}

#section1top #car{
	width: 40%;
	align-self: flex-start;
	position: relative;
	top: 60px;
	right: 10px;
	transform: rotate(-15deg);
}

#section1bottom{
	display: flex;
	flex-direction: row;
	margin-top: 40px;
	justify-content: center;
}

#section1bottom #bus{
	align-self: flex-start;
	width: 50%;
	transform: rotate(5deg);
}

#section1bottom aside{
	display: flex;
	flex-direction: column;
	font-size: 16px;
	width: 40%;
	font-weight: 500;
}

#button2{
	width: 80%;
	margin: 0 auto;
	margin-top: 15px;
	text-align: center;
	font-size: 15px;
	padding: 10px 20px;
}

#section2{
	margin-top: 70px;
	width: 100%;
}

#meet h1{
		font-size: 40px;
		margin-bottom: 10px;
	}

#section2 h5{
	width: 75%;
	margin: 0 auto;
	font-weight: 200;
	font-size: 16px;
}

#section2 ul{
	list-style-type: none;
	padding-left: 0;
	line-height: 3;
	width: 90%;
	margin: 0 auto;
	margin-top: 3%;
	font-size: 14px;
}

#section2 img{
	z-index: -1;
	width: 36%;
	margin-left: 32%;
	margin-top: 4%;
}

#button3{
	font-size: 16px;
	padding: 10px;
	text-align: center;
	width: 40%;
	max-width: 150px;
	margin: 0 auto;
	margin-top: 5%;
}

#section3{
	margin-top: 40px;
	width: 100%;
}


#section3 p{
	width: 52%;
	margin: 0 auto;
	margin-top: 15px;
	font-weight: 500;
	font-size: 18px;
}

#section3 button{
	width: 40%;
	max-width: 150px;
	font-size: 16px;
	padding: 10px;
	margin: 0 auto;
	margin-top: 20px;
}

#section4{
	margin-top: 15%;
	margin-bottom: 15%;
}

#section4 h1{
	text-align: center;
	font-size: 24px;
}

#section4 #paragraphs{
    width: 75%;
    margin: 0 auto;
    line-height: 2;
    font-weight: 200;
    font-size: 14px;
}

#section4 #topflip{
	width: 30%;
	float: left;
}

#section4 button{
	clear: both;
}


#section4 #button6{
	width: 30%;
	font-size: 15px;
	padding: 5px;
	margin-top: 20px;
}

#section4 #bottomflip{
	width: 30%;
	float: right;
}

#footers{
	clear: both;
}

footer{
	display: flex;
	justify-content: space-around;
	width: 100%;
	margin-bottom: 5%;
	align-items: center;
}


footer > a{
	width: 15%;
}

footer > a > img{
	width: 100%;
}

#links{
	margin-right: 27%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

#button5{
	max-width: 190px;
	font-size: 20px;
	padding: 10px 30px;
	width: 100%;
}

#button6{
		font-size: 16px;
		max-width: 250px;
		margin-top: 10px;
		padding: 8px 20px;
}

.partnerlink{
	text-decoration: none;
	color: #595e9e;
	text-shadow: #b7b7b7 1px 1px 2px;
	transition: text-shadow .2s, bottom .2s;
	position: relative;
	bottom: 0px;
}

.partnerlink:hover{
	color: #7a7fc7;
	text-shadow: #b7b7b7 2px 2px 5px;
	bottom: 3px;

}


@media screen and (min-width: 700px){


	.text{
		font-size: 16px;
	}

	#meet h1{
		font-size: 32px;
		margin-bottom: 0px;
	}

	#subhead{
		width: 70%;
		font-size: 28px;
	}

	#section3 p{
		width: 60%;
	}

	#intro{
		font-size: 20px;
	}

	#intro2{
		font-size: 20px;
	}

	#button1{
		font-size: 28px;
		margin: 0 auto;
		margin-top: 8%;
		width: 40%;
		max-width: 250px;
		padding: 16px 25px;
	}

	#button2{
		font-size: 24px;
		max-width: 200px;
	}

	#button3{
		font-size: 24px;
		max-width: 200px;

	}

	#meet h1{
		margin-bottom: 20px;
		font-size: 42px;
	}

	#section2 h5{
		font-size: 20px;
		width: 65%;
		font-weight: 400;
	}

	#section2 ul{
		font-size: 18px;
		line-height: 3;
		margin-bottom: 15px;
		margin-top: 1.5%;
	}

	#section3 p{
		font-size: 25px;
		margin-top: 40px;
	}

	#section3 button{
		font-size: 25px;
		width: 30%;
		margin: 0 auto;
		max-width: 250px;
		margin-top: 30px;
	}

	#section4{
		margin-top: 15%;
		margin-bottom: 10%;
	}

	#section4 h1{
		font-size: 36px;
	}

	#paragraphs{
		font-size: 20px;
	}

	#section4 #button6{
		font-size: 20px;
		width: 24%;
		margin-left: 38%;
		padding: 8px;
	}

	#links{
		margin-right: 30%;
	}

	#button5{
		font-size: 24px;
		max-width: 210px;
		padding: 10px 35px;
	}

	#button6{
		font-size: 20px;
	}

}



@media screen and (min-width: 1000px){

.video-responsive {
    overflow: hidden;
    padding-bottom: 30.25%;
    width: 53%;
    position: relative;
    height: 0;
    margin: 0 auto;}

	#logo{
		width: 75%;
		margin: 0 auto;
		margin-top: 3%;
	}

	#corner{
		width: 31%;
	}

	#subhead{
		bottom: 5vw;
	}

	#button1{
		width: 30%;
		margin: 0 auto;
		margin-top: 7%;
		font-size: 24px;
	}


	#section1 #plane{
		width: 26%;
	}

	#intro{
		margin: 0px;
		font-size: 42px;
		position: relative;
		left: 15px;
	}

	#intro2{
		font-size: 42px;
	}

	#section1 #car{
		width: 37%;
		right: 43px;
	}

	#button2{
		width: 50%;
	}

	#section2{
		margin-top: 0px;
	}

	#section2 ul{
		font-size: 18px;
	}

	#section2 img{
	z-index: -1;
	width: 25%;
	margin-left: 37.5%;
	margin-top: 4%;
}


	#section3{
		margin-top: 100px;
	}

	#section3 aside{
		margin-top: 80px;
	}

	#section3 button{
		width: 70%;
	}


	#meet h1{
		font-size: 60px;
	}

	#meet h5{
		font-size: 24px;
		width: 70%;
		font-weight: 200;
		margin-top: 20px;
	}

	#button3{
		font-size: 20px;
		margin: 0 auto;
		margin-top: 2%;
		width: 15%;
		max-width: 216px;
		display: block;
	}

	#section4{
		margin-top: 10%;
		margin-bottom: 5%;
	}

	#section4 h1{
		font-size: 40px;
	}

	.text{
		font-size: 20px;
	}

	#section4 #paragraphs{
		line-height: 2;
		width: 60%;
		font-size: 5px;
		margin-top: 3%;
		max-width: 803px;
	}


	#section4 #button6{
		max-width: 250px;
		margin-top: 30px;
	}

	footer > a{
	width: 10%;
}

	footer > a > img{
		width: 100%;
	}

	#links{
		margin-right: 29%;
	}


}

@media screen and (min-width: 1250px){

	.video-responsive{
	overflow: hidden;
	padding-bottom: 28.25%;
	width: 50%;
	position: relative;
	height: 0;
	margin: 0 auto;
}

.video-responsive iframe{
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	position: absolute;
}

footer > a{
	width: 8%;
}

	footer > a > img{
		width: 100%;
	}

	#links{
		margin-right: 30%;
	}


}




</style>
