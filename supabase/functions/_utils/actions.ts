import type { Message } from './types.ts'
import { actionTypes } from './global_constants.ts'
import { 
    supabaseClient,
    jwtDecoder,
    getRequest,
    getOrganization
} from './supabase.ts'

export const request_submitted_to_your_org = async (authToken : string, request_id : string) => {
    const request = getRequest(authToken, request_id)

    console.log('request')
    console.log(request)

    if ( request && request.repository && request.repository.organization_id ) {
        const organization = getOrganization(authToken, request.repository.organization_id)
        console.log('organization')
        console.log(organization)
    }
}