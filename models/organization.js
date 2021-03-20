import { FirestoreDocument } from './firestore-document'

/**
 *
 *
 * @exports Organization
 * @class Organization
 * @extends {FirestoreDocument}
 */
export class Organization extends FirestoreDocument {
    /**
     * Creates an instance of Organization.
     * @param {*} [doc={}]
     * @memberof Organization
     */
    constructor (doc = {}) {
        super(doc)
    }

    /**
     *
     *
     * @readonly
     * @memberof Organization
     */
    get address () {
        return this.doc.data().address
    }

    /**
     *
     *
     * @readonly
     * @memberof Organization
     */
    get name () {
        return this.doc.data().name
    }

    /**
     *
     *
     * @readonly
     * @memberof Organization
     */
    get pricing () {
        return this.doc.data().pricing || {}
    }

    /**
     *
     *
     * @readonly
     * @memberof Organization
     */
    get users () {
        return this.doc.data().users || []
    }
}
