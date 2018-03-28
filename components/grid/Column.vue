<template>
	<div :class="this.class">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: 'column',
		props: {
			sm: {
				type: String,
				required: false,
				default: 'full',
				validate(input) { return this.validateWidth(input) }
			},
			md: {
				type: String,
				required: false,
				default: 'full',
				validate(input) { return this.validateWidth(input) }
			},
			lg: {
				type: String,
				required: false,
				default: 'full',
				validate(input) { return this.validateWidth(input) }
			},
			xl: {
				type: String,
				required: false,
				default: 'full',
				validate(input) { return this.validateWidth(input) }
			}
		},
		methods: {
			validateWidth(input) {
				return ['1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/6', '5/6', 'full', 'auto'].indexOf(input) !== -1
			}
		},
		computed: {
			class() {
				let out = 'w-full'
				if(this.sm !== 'full') { out += ` sm:w-${this.sm}` }
				if(this.md !== 'full') { out += ` md:w-${this.md}` }
				if(this.lg !== 'full') { out += ` lg:w-${this.lg}` }
				if(this.xl !== 'full') { out += ` xl:w-${this.xl}` }

				return out
			}
		}
	}
</script>