/**
 * It listens for a user login, then updates
 * the users location in the store
 */
export const locationUpdater = (store) => {
    // called when the store is initialized
    store.subscribe(({ type, payload }, state) => {
    // called after every mutation.

        // The mutation comes in the format of `{ type, payload }`.
        // If user meta is populated with setAgent and user wants notifications
        // we update the location
        if (type == 'meta/setAgent' && payload == true) {
            console.group('Location Updater - location-updater.js')
            console.log('Updating location')
            store.dispatch('meta/updateCurrentLocation')
            console.groupEnd('Location Updater - location-updater.js')
        }
    })
}
