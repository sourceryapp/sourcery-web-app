import { FirestoreDocument } from './firestore-document'

const DRAFT = 'draft'
const PENDING = 'pending'
const PICKED_UP = 'picked_up'
const ARCHIVED = 'archived'
const RESERVED = 'reserved'
const COMPLETE = 'complete'

export class Job extends FirestoreDocument {
    #job = {}

    constructor (doc = {}) {
        super(doc)
    }

    get attachments () {
        return this.doc.data().attachments || []
    }

    get citation () {
        return this.doc.data().citation
    }

    get client_id () {
        return this.doc.data().client_id
    }

    get created_at () {
        return this.doc.data().created_at
    }

    get label () {
        return this.doc.data().label
    }

    get pages () {
        return Number(this.doc.data().pages)
    }

    get pricing () {
        return this.doc.data().pricing
    }

    get repository () {
        return this.doc.data().repository
    }

    get repository_id () {
        return this.doc.data().repository_id
    }

    get status () {
        return this.doc.data().status
    }

    get vendor_id () {
        return this.doc.data().vendor_id
    }

    get userRating () {
        return Number(this.doc.data().userRating) || 0
    }

    setAttachments (a) {
        this.#job.attachments = Array.isArray(a) ? a : []
    }

    setCitation (c) {
        this.#job.citation = c
    }

    setClient_id (c) {
        this.#job.client_id = c
    }

    setCreated_at (c) {
        this.#job.created_at = c
    }

    setLabel (l) {
        this.#job.label = l
    }

    setPages (p) {
        this.#job.pages = p
    }

    setPricing (p) {
        this.#job.pricing = p
    }

    setRepository (r) {
        this.#job.repository = r
    }

    setRepository_id (r) {
        this.#job.repository_id = r
    }

    setStatusDraft () {
        this.#job.status = DRAFT
    }

    setStatusComplete () {
        this.#job.status = COMPLETE
    }

    setStatusPending () {
        this.#job.status = PENDING
    }

    setStatusPickedUp () {
        this.#job.status = PICKED_UP
    }

    setStatusArchived () {
        this.#job.status = ARCHIVED
    }

    setStatusReserved () {
        this.#job.status = RESERVED
    }

    setVendor_id (i) {
        this.#job.vendor_id = i
    }

    setUserRating (i) {
        this.#job.userRating = (i > 0 && i <= 5) ? i : 0
    }

    toJSON () {
        return this.id ? this.doc.data() : this.#job
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
