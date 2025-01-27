<script setup>
const { currentMode, setMode } = useChangeModes()

async function changeMode(val) {
    if ( val === 'researcher' ) {
        console.log('switching researcher')
        await setMode('researcher')
    } else {
        console.log('switching sourcerer')
        await setMode('sourcerer')
    }
}
</script>

<template>
    <v-switch
        v-model="currentMode"
        v-on:update:model-value="changeMode"
        hide-details
        true-value="sourcerer"
        false-value="researcher"
        :label="currentMode === 'sourcerer' ? 'Sourcerer' : 'Researcher'"
        class="modeSwitch"
        inset
        width="143"
    >
        <template v-slot:label="{ label }">
            <span class="text-body-2 pe-2">{{ label }}</span>
        </template>
    </v-switch>
</template>

<style lang="scss">
//.modeSwitch {
//    .v-switch__track {
//        background-color: rgb(var(--v-theme-primary))!important;
//    }
//}
</style>