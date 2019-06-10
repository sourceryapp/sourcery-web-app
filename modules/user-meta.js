import { db } from '~/plugins/firebase-client-init.js'

/**
 * Class for accessing and setting UserMeta key/value pairs
 */
export class UserMeta {

    /**
     * Firebase collection in which to store
     * the user-meta.
     */
    collection = 'user-meta';

    /**
     * UID of User
     */
    uid = null;

    /**
     * Cloud firestore reference to the Document
     */
    metaRef = null;


    constructor(uid){
        this.uid = uid;
        this.metaRef = db.collection(this.collection).doc(this.uid);
    }

    async set(key, value){
        return this.metaRef.set({
            [key]: value
        })
    }

    async get(key){
        let data = await this.metaRef.get()
        return data.data()[key];
    }
}
