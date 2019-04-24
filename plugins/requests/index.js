import { db } from '../firebase-client-init'

let collection = 'requests';
export default {
    /**
     * Set the Request status to "complete"
     */
    markAsComplete: async (id) => {
        return await db.collection(collection).doc(id).update({ status: 'complete' });
    }
}
