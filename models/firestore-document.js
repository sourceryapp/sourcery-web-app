/**
 * Wrapper for {@link https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot|DocumentSnapshot}
 * @class FirestoreDocument
 * @abstract
 * @exports FirestoreDocument
 */
export class FirestoreDocument {
    /**
     * @readonly
     */
    id;
    fields = {}

    /**
     * Creates an instance of FirestoreDocument.
     * @param {DocumentSnapshot} doc
     * @memberof FirestoreDocument
     * @constructs
     */
    constructor (doc) {
        this.doc = doc
    }

    /**
     *
     * Property of the DocumentSnapshot that signals whether or not the data exists. True if the document exists.
     * @readonly
     * @memberof FirestoreDocument
     */
    get exists () {
        return this.doc.exists
    }

    /**
     *
     * Metadata about the DocumentSnapshot, including information about its source and local modifications.
     * @readonly
     * @memberof FirestoreDocument
     */
    get metadata () {
        return this.doc.metadata
    }

    /**
     *
     * The DocumentReference for the document included in the DocumentSnapshot.
     * @readonly
     * @memberof FirestoreDocument
     */
    get ref () {
        return this.doc.ref
    }

    /**
     *
     * Retrieves all fields in the document as an Object. Returns 'undefined' if the document doesn't exist.
     * @param {*} [options={}] An options object to configure how data is retrieved from the snapshot (e.g. the desired behavior for server timestamps that have not yet been set to their final value).
     * @return {Object}
     * @memberof FirestoreDocument
     */
    data (options = {}) {
        return this.doc.data(options)
    }

    /**
     *
     * Retrieves the field specified by fieldPath. Returns undefined if the document or field doesn't exist.
     * @param {String} fieldPath Path to the field
     * @param {SnapshotOptions} [options={}]
     * @return {*} The data at the specified field location or undefined if no such field exists in the document.
     * @memberof FirestoreDocument
     */
    get (fieldPath, options = {}) {
        return this.doc.get(fieldPath, options)
    }

    /**
     *
     * Returns true if this DocumentSnapshot is equal to the provided one.
     * @param {DocumentSnapshot} ds  see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot|DocumentSnapshot}
     * @return {Boolean}
     * @memberof FirestoreDocument
     */
    isEqual (ds) {
        return this.doc.isEqual(ds)
    }

    save () {
        if (this.doc.exists) {
            return this.doc.ref.set(this.fields, { merge: true })
        } else {
            return this.doc.parent.add(this.fields)
        }
    }

    // update() {
    //     return this.ref.update(this.#job, { merge: true })
    // }

    delete () {
        return this.ref.delete()
    }
}
