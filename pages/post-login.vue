<template>

</template>

<script setup>
const { fetchUserMetadata, userOrgs } = useAuthUser()
await fetchUserMetadata()
if ( userOrgs.value.length > 0 ) {
    await navigateTo(`/o/${userOrgs.value[0].id}`)
} else {
    await navigateTo('/dashboard')
}
</script>