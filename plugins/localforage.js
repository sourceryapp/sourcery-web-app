import localForage from 'localforage'

localForage.config({
	driver: [localForage.INDEXEDDB, localForage.WEBSQL, localForage.LOCALSTORAGE],
	storeName: 'tube'
})


localForage.ready().then(function() {
    // This code runs once localforage
    // has fully initialized the selected driver.
    console.log(localForage.driver()); // LocalStorage
}).catch(function (e) {
    console.log(e); // `No available storage method found.`
    // One of the cases that `ready()` rejects,
    // is when no usable storage driver is found
});