/**
 * Wrapper for DocumentSnapshot
 * @url https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
 */
export class FirestoreDocument {
    constructor (doc) {
        this.doc = doc
    }

    get exists () {
        return this.doc.exists
    }

    get id () {
        return this.doc.id || null
    }

    get metadata () {
        return this.doc.metadata
    }

    get ref () {
        return this.doc.ref
    }

    data (options = {}) {
        return this.doc.data(options)
    }

    get (fieldPath, options = {}) {
        return this.doc.get(fieldPath, options)
    }

    isEqual (DocumentSnapshot) {
        return this.doc.isEqual(DocumentSnapshot)
    }
}
