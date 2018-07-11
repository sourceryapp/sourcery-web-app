<template>
    <div></div>
</template>
<script>

    import localForage from "localforage";
    import axios from 'axios'

    export default (({route, redirect, store}) => {
        store.dispatch('auth/clearToken').then(() => {
            if (!['login', 'register', 'index'].includes(route.name)) {
                redirect('/login')
            }
        })
    })

</script>
