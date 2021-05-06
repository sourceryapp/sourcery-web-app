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
    constructor (doc) {
        super(doc)

        if (doc.exists) {
            this.id = doc.id
            this.fields = doc.data()

            delete this.fields.users

            this.owner = doc.data().owner || doc.data().users[0]
        }
    }

    get address () {
        return this.fields.address
    }

    set address (val) {
        this.fields.address = val
    }

    get name () {
        return this.fields.name
    }

    set name (val) {
        this.fields.name = val
    }

    get owner () {
        return this.fields.owner
    }

    set owner (val) {
        this.fields.owner = val
    }

    get pricing () {
        return this.fields.pricing
    }

    set pricing (val) {
        this.fields.pricing = val
    }
}
