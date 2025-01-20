<template>
    <div class="input-tel">
        <v-input prepend-icon="mdi-phone" :rules="[validate]" ref="vuetifyInput" validate-on="submit">
            <template v-slot:default>
                <v-field variant="outlined" size="x-large" label="Phone Number" active :error="vuetifyInput ? !vuetifyInput.isValid : false">
                    <input type="tel" ref="input" class="v-field__input" @countrychange="vuetifyInput.validate"/>
                </v-field>
            </template>
        </v-input>
    </div>
</template>

<script setup>
// This is a vuetify wrapper for the intl-tel-input library
import '/node_modules/intl-tel-input/build/css/intlTelInput.css'
import intlTelInput from 'intl-tel-input'
import utilsScript from '/node_modules/intl-tel-input/build/js/utils.js?url'
import flagsUrl from '/node_modules/intl-tel-input/build/img/flags.png'
import flags2xUrl from '/node_modules/intl-tel-input/build/img/flags@2x.png'
import globeUrl from '/node_modules/intl-tel-input/build/img/globe.png'
import globe2xUrl from '/node_modules/intl-tel-input/build/img/globe@2x.png'

const input = ref(null)
const telInput = ref(null)
const vuetifyInput = ref(null)

onMounted(() => {
    telInput.value = intlTelInput(input.value, {
        utilsScript: utilsScript,
        initialCountry: "us",
        showSelectedDialCode: true,
        preferredCountries: ['us', 'gb'],
        countrySearch: false
    })

    // UtilsScript is loaded async, so we must wait until it resolves to run any global methods
    // telInput.value.promise.then((telInput) => {})
})

/**
 * This method is written to mimic the callbacks in the "rules" attribute of v-inputs.
 * Return false for general error without message.
 * Return string for error with message.
 * Return true for no error.
 */
function validate() {
    if ( !telInput.value ) {
        return false
    }

    if ( !telInput.value.getNumber() ) {
        return 'Phone number is required.'
    }    

    const error = telInput.value.getValidationError()
    console.log(intlTelInput)
    switch(error) {
        case intlTelInput.utils.validationError.TOO_SHORT:
            return 'Phone number is too short.'
        case intlTelInput.utils.validationError.TOO_LONG:
            return 'Phone number is too long.'
        case intlTelInput.utils.validationError.NOT_A_NUMBER:
            return 'Phone number is not a number.'
        case intlTelInput.utils.validationError.INVALID_COUNTRY_CODE:
            return 'Invalid country code.'
        case intlTelInput.utils.validationError.TOO_SHORT_AFTER_IDD:
            return 'Phone number is too short after IDD.'
        case intlTelInput.utils.validationError.TOO_LONG_AFTER_IDD:
            return 'Phone number is too long after IDD.'
    }

    return true
}

function getValue() {
    if ( telInput.value ) {
        return telInput.value.getNumber()
    }
    return false
}

defineExpose({
    getValue
})
</script>

<style>
.iti {
  --iti-path-flags-1x: url(v-bind(flagsUrl));
  --iti-path-flags-2x: url(v-bind(flags2xUrl));
  --iti-path-globe-1x: url(v-bind(globeUrl));
  --iti-path-globe-2x: url(v-bind(globe2xUrl));
}

.input-tel .v-field {
    z-index: 1;
}

.v-theme--dark .iti__dropdown-content {
    background-color: rgb(var(--v-theme-surface));
}
</style>