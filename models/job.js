import { FirestoreDocument } from './firestore-document'

const DRAFT = 'draft'
const PENDING = 'pending'
const PICKED_UP = 'picked_up'
const ARCHIVED = 'archived'
const RESERVED = 'reserved'
const COMPLETE = 'complete'

/**
 * Job Class
 * @exports Job
 * @class Job
 * @extends {FirestoreDocument}
 */
export class Job extends FirestoreDocument {
    #mods = {}

    /**
     * Creates an instance of Job.
     * @param {*} [doc={}]
     * @memberof Job
     */
    constructor (doc = {}) {
        super(doc)
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get attachments () {
        return this.doc.data().attachments || []
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get citation () {
        return this.doc.data().citation
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get client_id () {
        return this.doc.data().client_id
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get created_at () {
        return this.doc.data().created_at
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get label () {
        return this.doc.data().label
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get pages () {
        return Number(this.doc.data().pages)
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get pricing () {
        return this.doc.data().pricing
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get repository () {
        return this.doc.data().repository
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get repository_id () {
        return this.doc.data().repository_id
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get status () {
        return this.doc.data().status
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get vendor_id () {
        return this.doc.data().vendor_id
    }

    /**
     *
     *
     * @readonly
     * @memberof Job
     */
    get userRating () {
        return Number(this.doc.data().userRating) || 0
    }

    /**
     *
     *
     * @param {*} a
     * @memberof Job
     */
    setAttachments (a) {
        this.#mods.attachments = Array.isArray(a) ? a : []
    }

    /**
     *
     *
     * @param {*} c
     * @memberof Job
     */
    setCitation (c) {
        this.#mods.citation = c
    }

    /**
     *
     *
     * @param {*} c
     * @memberof Job
     */
    setClient_id (c) {
        this.#mods.client_id = c
    }

    /**
     *
     *
     * @param {*} c
     * @memberof Job
     */
    setCreated_at (c) {
        this.#mods.created_at = c
    }

    /**
     *
     *
     * @param {*} l
     * @memberof Job
     */
    setLabel (l) {
        this.#mods.label = l
    }

    /**
     *
     *
     * @param {*} p
     * @memberof Job
     */
    setPages (p) {
        this.#mods.pages = p
    }

    /**
     *
     *
     * @param {*} p
     * @memberof Job
     */
    setPricing (p) {
        this.#mods.pricing = p
    }

    /**
     *
     *
     * @param {*} r
     * @memberof Job
     */
    setRepository (r) {
        this.#mods.repository = r
    }

    /**
     *
     *
     * @param {*} r
     * @memberof Job
     */
    setRepository_id (r) {
        this.#mods.repository_id = r
    }

    /**
     *
     *
     * @memberof Job
     */
    setStatusDraft () {
        this.#mods.status = DRAFT
    }

    /**
     *
     *
     * @memberof Job
     */
    setStatusComplete () {
        this.#mods.status = COMPLETE
    }

    /**
     *
     *
     * @memberof Job
     */
    setStatusPending () {
        this.#mods.status = PENDING
    }

    /**
     *
     *
     * @memberof Job
     */
    setStatusPickedUp () {
        this.#mods.status = PICKED_UP
    }

    /**
     *
     *
     * @memberof Job
     */
    setStatusArchived () {
        this.#mods.status = ARCHIVED
    }

    /**
     *
     *
     * @memberof Job
     */
    setStatusReserved () {
        this.#mods.status = RESERVED
    }

    /**
     *
     *
     * @param {*} i
     * @memberof Job
     */
    setVendor_id (i) {
        this.#mods.vendor_id = i
    }

    /**
     *
     *
     * @param {*} i
     * @memberof Job
     */
    setUserRating (i) {
        this.#mods.userRating = (i > 0 && i <= 5) ? i : 0
    }

    /**
     *
     *
     * @return {*}
     * @memberof Job
     */
    toJSON () {
        return this.id ? this.doc.data() : this.#mods
    }

    isDraft = () => this.status === DRAFT

    isComplete = () => this.status === COMPLETE

    isPending = () => this.status === PENDING

    isPickedUp = () => this.status === PICKED_UP

    isArchived = () => this.status === ARCHIVED

    isReserved = () => this.status === RESERVED

    prettyStatus = () => this.status.replace('_', ' ')

    isMemberRepo = () => this.repository.organization !== undefined
}
