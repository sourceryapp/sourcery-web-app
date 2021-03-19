import { Job } from '../models/job'
import { job } from './mocks/job'

// Sample Job
const validJob = new Job(job);


describe('Job Model Tests', () => {
    test('property getters', () => {
        expect(validJob.attachments).toContain(job.data().attachments[0])
        expect(validJob.client_id).toEqual(job.data().client_id)
        expect(validJob.created_at).toEqual(job.data().created_at)
        expect(validJob.label).toEqual(job.data().label)
        expect(validJob.pages).toEqual(job.data().pages)
        expect(validJob.pricing.total).toEqual(job.data().pricing.total)
        expect(validJob.repository.name).toEqual(job.data().repository.name)
        expect(validJob.repository_id).toEqual(job.data().repository_id)
        expect(validJob.status).toEqual(job.data().status)
    })

    test('methods return correct job status', () => {
        expect(validJob.isArchived()).toEqual(false)
        expect(validJob.isComplete()).toEqual(false)
        expect(validJob.isDraft()).toEqual(false)
        expect(validJob.isPending()).toEqual(false)
        expect(validJob.isPickedUp()).toEqual(true)
        expect(validJob.isReserved()).toEqual(false)
        expect(validJob.prettyStatus()).toEqual('picked up')

    })

})
