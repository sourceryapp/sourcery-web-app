import { supabase } from '~/plugins/supabase'

const TABLE_NAME = 'public.status'

export interface SourceryStatus {
    id: BigInteger,
    name: string
}

export class Status {
    id: BigInteger
    name: string

    constructor({ id, name }: SourceryStatus) {
        this.id = id,
        this.name = name
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }

    private refresh(data : SourceryStatus|SourceryStatus[]|null) {
        if ( !data ) {
            return false
        }
        if ( Array.isArray(data) ) {
            data = { ...data[0] }
        }
        this.id = data.id,
        this.name = data.name
        return true
    }
}