/**
 * These methods are added to DocumentSnapshot
 * `doc.request().method()`
 * @url https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
 */

export default function() {
    // Make sure the document is of type "request" before continuing?
    // ...

    // Add new Methods here...
    return {

        /**
         * Just for Testing
         */
        testing: () => {
            console.info("Testing", this.data());
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
         * eventually
         */
        markComplete: async () => {
            // return await db.collection(collection).doc(id).update({ status: 'complete' });
        }

    }


}
