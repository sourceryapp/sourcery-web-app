// @example https://github.com/Upstatement/firestore-jest-mock/blob/master/__tests__/mock-firestore.test.js
// @url https://github.com/Upstatement/firestore-jest-mock
import { FakeFirestore } from 'firestore-jest-mock'

// Model that we want to test
import { Job } from '../models'

// Fake record(s) for firestore
import { readFileSync } from 'fs'
const job = JSON.parse(readFileSync(`${__dirname}/mocks/job.json`))

// Placeholder for the Job Object
let testJob;

beforeAll( async () => {
    // Create a fake firestore db
    const db = new FakeFirestore({
        "requests": job
    })

    // Query the fake db for a request
    let doc = await db.collection('requests').doc('04whT2LMmpL5JX7GpKQP').get()

    // Wrap the doc with our Job class
    testJob = new Job(doc);

})

describe('Job Model Tests', () => {
    test('property getters', () => {
        expect(testJob.attachments).toContain(testJob.data().attachments[0])
        expect(testJob.client_id).toEqual(testJob.data().client_id)
        expect(testJob.created_at).toEqual(testJob.data().created_at)
        expect(testJob.label).toEqual(testJob.data().label)
        expect(testJob.pages).toEqual(testJob.data().pages)
        expect(testJob.pricing.total).toEqual(testJob.data().pricing.total)
        expect(testJob.repository.name).toEqual(testJob.data().repository.name)
        expect(testJob.repository_id).toEqual(testJob.data().repository_id)
        expect(testJob.status).toEqual(testJob.data().status)
    })

    test('methods return correct job status', () => {
        expect(testJob.isArchived()).toEqual(false)
        expect(testJob.isComplete()).toEqual(false)
        expect(testJob.isDraft()).toEqual(false)
        expect(testJob.isPending()).toEqual(false)
        expect(testJob.isPickedUp()).toEqual(true)
        expect(testJob.isReserved()).toEqual(false)
        expect(testJob.prettyStatus()).toEqual('picked up')

    })

})
