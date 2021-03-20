import { FirestoreDocument } from './firestore-document'

export class Repository extends FirestoreDocument {
    #repository = {}

    constructor (doc = {}) {
        super(doc)
    }

    get address1 () {
        return this.doc.data().address1
    }

    get address2 () {
        return this.doc.data().address2
    }

    get city () {
        return this.doc.data().city
    }

    get country_code () {
        return this.doc.data().country_code
    }

    get geo () {
        return this.doc.data().geo
    }

    get institution () {
        return this.doc.data().institution
    }

    get name () {
        return this.doc.data().name
    }

    get postal_code () {
        return this.doc.data().postal_code
    }

    get secondary_location () {
        return this.doc.data().secondary_location
    }

    get state () {
        return this.doc.data().state
    }
}
