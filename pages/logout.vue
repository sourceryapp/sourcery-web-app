<script setup>
const supabase = useSupabaseClient()

// The reason I have to do this is because some pages might still be dynamically updating the user object when this page is starting to render.  Another option is probably to run this on mounted, but I found this reliable.
nextTick().then(async () => {
    await supabase.auth.signOut()
    navigateTo('/login')
})
</script>

<template>
    <div id="logout">
        <p>Logging out....</p>
    </div>
</template>