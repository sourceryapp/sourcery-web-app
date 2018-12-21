<template>
    <h3>Import Repositories</h3>
</template>

<script>

import items from '~/assets/csvjson.json';
import firebase from 'firebase/app'
import { db } from '~/plugins/firebase-client-init.js'

    export default {
        name: "import",
        auth: false,
        mounted() {
            // items.forEach(item => {
            //     db.collection("repositories").add({
            //         address1: item.address1,
            //         address2: item.address2,
            //         city: item.city,
            //         country_code: item.country_code,
            //         geo: new firebase.firestore.GeoPoint(item.lat, item.long),
            //         institution: item.institution,
            //         name: item.name,
            //         postal_code: item.postal_code,
            //         secondary_location: item.secondary_location,
            //         state: item.state,
            //     })
            // });
            // console.log(db);


        }

    }
</script>

<style scoped>

</style>
