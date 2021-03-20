import { FirestoreDocument } from './firestore-document'

export class User extends FirestoreDocument {
    #user = {}

    constructor (doc = {}) {
        super(doc)
    }

    get agentPush () {
        return this.doc.data().agentPush
    }

    get agentUpdates () {
        return this.doc.data().agentUpdates
    }

    get location () {
        return this.doc.data().location
    }

    get onBoardingComplete () {
        return this.doc.data().onBoardingComplete || false
    }

    get organizations () {
        return this.doc.data().organizations || []
    }

    get phone () {
        return this.doc.data().phone
    }

    get researcher () {
        return this.doc.data().researcher
    }

    get stripe () {
        return this.doc.data().stripe || {}
    }

    get stripeCustomerId () {
        return this.doc.data().stripeCustomerId
    }

    get token () {
        return this.doc.data().token
    }
}
