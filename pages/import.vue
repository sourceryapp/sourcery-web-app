<template>
    <div>
        <h3>Import Repositories</h3>
        <v-btn @click="runImport">Run Import</v-btn>

        <h5 v-if="records.length">Importing...</h5>
        <ol>
            <li v-for="(record, index) in records" :key=index>{{ record }}</li>
        </ol>
    </div>

</template>

<script>

import items from '~/assets/csvjson.json';
import firebase from 'firebase/app'
import { db } from '~/plugins/firebase-client-init.js'

    export default {
        name: "import",
        auth: false,
        data() {
            return {
                records: []
            }
        },
        methods: {
            runImport() {

                let that = this
                items.forEach(item => {
                    if(item.name !== ''){
                        db.collection("repositories").add({
                            address1: item.address1,
                            address2: item.address2,
                            city: item.city,
                            country_code: item.country_code,
                            geo: new firebase.firestore.GeoPoint(item.lat, item.long),
                            institution: item.institution,
                            name: item.name,
                            postal_code: item.postal_code,
                            secondary_location: item.secondary_location,
                            state: item.state,
                        })
                        .then(function(){
                            console.log(`Imported "${item.name}"`);
                            that.records.push(item.name);
                        })
                        .catch(function(error){
                            console.error(error);
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
