<template>
    <NuxtLink :to="'/request/' + request.id" class="text-decoration-none">
        <v-sheet elevation="1" :class="additionalClasses">
            <p class="mb-1 text-body-2">{{ requestLabel }}</p>
            <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                    <v-icon>mdi-map-marker</v-icon>
                    <span class="text-caption">{{ repositoryLocation }}</span>
                </div>
                <div>
                    <v-badge v-if="isPaid" color="success" inline content="PAID"></v-badge>
                    <v-badge v-if="price" color="primary" inline :content="$utils.currencyFormat(totalPrice)"></v-badge>
                </div>
                
            </div>
        </v-sheet>
    </NuxtLink>
</template>

<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const props = defineProps({
    request: { type: Object, required: true },
    price: { type: Boolean, default: false }
})
const { request, repositoryLocation, requestLabel, isCompleted, isInProgress, isSubmitted, isCancelled, isPaid } = useFetchRequest(props.request)
const { totalPrice } = useManageUriRequest(request)

const additionalClasses = computed(() => {
    return {
        'mb-2 rounded-lg py-2 px-3 request-card border-lg': true,
        'border-success': isCompleted.value,
        'border-warning': isInProgress.value,
        'border-primary': isSubmitted.value,
        'border-danger': isCancelled.value,
    }
})

// const citation = computed(() => {
//     let max = mobile ? 100 : 300
//     let c = props.request.citation.substring(0, max)
//     return props.request.citation.length > max ? c + '...' : c
// })
</script>

<style lang="scss">
.request-card.border-success {
    background-color: #C8E6C9!important;
}
</style>