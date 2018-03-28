<template>
	<div :class="['container', 'mx-auto', `px-${gutter}`]">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "container",
		props: {
			gutter: {
				type: Number,
				required: false,
				default: 0,
				validate(input) {
					// make sure 0 <= value <= 8 and that value is an integer
					return input <= 8 && input >= 0 && Math.round(input) === input
				}
			}
		}
	}
</script>