/* eslint-disable */

/**
 * These methods are added to DocumentSnapshot
 * `doc.request().method()`
 * @url https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
 */

export default function () {
    // Make sure the document is of type "request" before continuing?
    // ...

    // Add new Methods here...
    return {

        /**
         * Just for Testing
         */
        testing: () => {
            console.info('Testing', this.data())
        },

        /**
         * Is the current request complete
         */
        isComplete: () => this.data().status === 'complete',

        /**
         * Is the current request pending
         */
        isPending: () => this.data().status === 'pending',

        /**
         * Is the current request picked up
         */
        isPickedUp: () => this.data().status === 'picked_up',

        /**
         * Is the current request picked up
         */
        isArchived: () => this.data().status === 'archived',

        /**
         * Complete current request
         */
        markComplete: async () => {
            return await $fire.firestore.collection('requests').doc(this.id).update({ status: 'complete' })
        },

        /**
         * Archive current request
         */
        markArchived: async () => {
            return await $fire.firestore.collection('requests').doc(this.id).update({ status: 'archived' })
        },

        /**
         * Delete current request
         */
        delete: async () => {
            return await $fire.firestore.collection('requests').doc(this.id).delete()
        },

        /**
         * Returns a human-readable version of status
         */
        prettyStatus: () => {
            let str = this.data().status.replace('_', ' ')
            const s = str.split(' ')
            for (let i = 0; i < s.length; i++) {
                s[i] = s[i][0].toUpperCase() + s[i].substr(1)
            }
            return s.join(' ')
        }

    }
}
