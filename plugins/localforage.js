import localForage from 'localforage'

localForage.ready().catch(() => {
})
localForage.config({
	driver: localForage.LOCALSTORAGE,
	storeName: 'tube'
})