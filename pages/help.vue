<template>
	<v-layout row>
		<v-flex xs12 sm6 offset-sm3>
            <h1>Help</h1>
            <v-expansion-panel>
                <v-expansion-panel-content
                        v-for="(item,i) in items"
                        :key="i"
                >
                    <div slot="header">{{ item.question }}</div>
                    <v-card>
                        <v-card-text>{{ item.answer }}</v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		name: "home",
		computed: {
			user() {
				return this.$store.state.auth.user
			}
		},
		data: function() {

		    return {
		        items: [
                    {
                        question: 'How do I do something?',
                        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu luctus lorem. Vestibulum ultricies mauris at felis interdum, non mollis elit fermentum. Vivamus accumsan lectus non quam aliquam, sed rutrum augue mattis. Quisque sit amet enim sed metus maximus rhoncus ut et sem. Donec semper ex neque. Vestibulum nec convallis nisl, vel cursus justo. In mollis dui quis tincidunt blandit. Aenean sem tortor, congue eget lorem in, porttitor ornare lorem. Vivamus ac velit quis turpis bibendum fermentum. Ut auctor ligula sit amet iaculis tincidunt. Quisque nec mollis diam. Maecenas lobortis tempus sem, at maximus est porta vel.',
                    },

                    {
                        question: 'When do I get my money?',
                        answer: 'Aenean fermentum ipsum vel nibh blandit finibus. Ut accumsan viverra sem in ornare. Duis ante metus, cursus imperdiet rhoncus sit amet, scelerisque vitae nisi. Quisque tristique eu sapien sit amet tristique. Nulla euismod dolor eu elit iaculis porttitor. Nulla id ultricies dui. Phasellus a urna ac nisi consequat volutpat et et ex. In hac habitasse platea dictumst. Suspendisse sagittis, massa vitae vehicula malesuada, nisi augue lobortis leo, ut feugiat risus nisi at augue. Nullam sit amet ex semper, porttitor enim sed, scelerisque erat. Etiam in faucibus libero.',
                    },
                    {
                        question: 'Is the Chem Building Really Sinking?',
                        answer: 'Pellentesque tempus velit a enim vehicula blandit. Suspendisse diam nunc, placerat eu ex et, fermentum dapibus leo. Praesent eu odio pulvinar, viverra nunc ac, ultrices est. Nullam ut nibh vehicula, mattis nulla quis, sagittis massa. Nulla facilisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum rutrum nisi ut elit venenatis, vel hendrerit quam rhoncus. Nam vel porta nisl. Aenean euismod tincidunt viverra. Suspendisse maximus ac purus eu scelerisque. Nulla sed turpis diam. Integer tincidunt diam et dolor fermentum molestie. Nulla sodales commodo ultrices.',
                    },
                    {
                        question: 'Something',
                        answer: 'Aenean non enim auctor lectus condimentum pretium eu auctor ex. Vivamus eleifend in libero placerat sagittis. In a neque id lacus malesuada gravida in quis est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ut mauris erat. Maecenas a pellentesque erat. Aliquam erat volutpat. Nullam rhoncus neque non dictum aliquet. Curabitur vitae tempor magna. Etiam vitae nisi in sapien consectetur sollicitudin non sit amet quam. Etiam dignissim, est ultricies dictum tincidunt, dui tellus fringilla erat, eget euismod velit augue sed libero. Duis at posuere dui, eget pretium elit. Proin hendrerit a turpis at rhoncus. Pellentesque hendrerit fringilla sodales. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
                    },
                    {
                        question: 'Something else',
                        answer: 'Integer elementum ut tellus eu faucibus. Phasellus nunc risus, tempus eu porta vitae, eleifend ut nulla. Cras vitae luctus justo, nec cursus sapien. Integer dictum eros ligula, ac efficitur erat consequat nec. Fusce elementum ligula eu tellus luctus consequat. Nulla imperdiet nisl vel euismod semper. Quisque at justo nunc. Nunc feugiat facilisis nulla, vel placerat est condimentum ut. Nullam bibendum ipsum enim. Donec quis sollicitudin nunc. Vivamus venenatis libero ut lectus ornare gravida ac ut tortor. Nam turpis turpis, accumsan id condimentum et, vehicula et lorem. Fusce a tincidunt neque. In hac habitasse platea dictumst.',
                    },
                    {
                        question: 'Blah',
                        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu luctus lorem. Vestibulum ultricies mauris at felis interdum, non mollis elit fermentum. Vivamus accumsan lectus non quam aliquam, sed rutrum augue mattis. Quisque sit amet enim sed metus maximus rhoncus ut et sem. Donec semper ex neque. Vestibulum nec convallis nisl, vel cursus justo. In mollis dui quis tincidunt blandit. Aenean sem tortor, congue eget lorem in, porttitor ornare lorem. Vivamus ac velit quis turpis bibendum fermentum. Ut auctor ligula sit amet iaculis tincidunt. Quisque nec mollis diam. Maecenas lobortis tempus sem, at maximus est porta vel.',
                    },

                ]
            }

		}
	}
</script>

<style scoped>

</style>