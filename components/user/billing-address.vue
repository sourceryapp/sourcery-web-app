<script setup>
const { authUser } = useAuthUser()
const { stripe } = useStripe()
const supabase = useSupabaseClient()
const { updateProfile } = useUpdateProfile()

const billingAddressElement = ref(null)
const paymentDetails = ref(null)
const { data } = await supabase.from('payment_details')
    .select()
    .eq('user_id', authUser.value.id).single()
if ( data ) {
    paymentDetails.value = data
}


onMounted(() => {
    const options = {
        mode: 'setup',
        currency: 'usd',
        // Fully customizable with appearance API.
        appearance: {/*...*/},
    };

    // Set up Stripe.js and Elements to use in checkout form
    const elements = stripe.value.elements(options);

    if ( !billingAddressElement.value ) {
        // Create the Address Element in billing mode
        billingAddressElement.value = elements.create('address', {
            mode: 'billing',
            defaultValues: {
                name: authUser.value?.name,
                address: {
                    line1: paymentDetails.value?.line1,
                    line2: paymentDetails.value?.line2,
                    city: paymentDetails.value?.city,
                    state: paymentDetails.value?.state,
                    postal_code: paymentDetails.value?.postal_code,
                    country: paymentDetails.value?.country || 'US',
                }
            }
        });

        billingAddressElement.value.mount('#billing-address')
    }
})


async function submitForm() {
    const formValue = await billingAddressElement.value.getValue()
    if ( formValue.complete ) {
        const updatingAttributes = { ...formValue.value.address }

        if ( !paymentDetails.value ) {
            const { data: insertData, error: insertError } = await supabase.from('payment_details')
                .insert({
                    user_id: authUser.value.id,
                    ...updatingAttributes
                }).select().single()

            paymentDetails.value = insertData
        } else {
            const { data: updateData, error: updateError } = await supabase.from('payment_details')
                .update(updatingAttributes)
                .eq('user_id', authUser.value.id)
                .select().single()

            paymentDetails.value = updateData
        }

        if ( authUser.value.name !== formValue.value.name ) {
            await updateProfile({ name: formValue.value.name })
        }
    }
}
</script>

<template>
    <div>
        <form @submit.prevent="submitForm">
            <div id="billing-address" class="mb-4"></div>
            <v-btn type="submit">Save</v-btn>
        </form>
    </div>
</template>