import { supabase } from '~/plugins/supabase'

const TABLE_NAME = 'public.status'

export class Status {
    id: BigInt
    name: string

    constructor({ id, name }: Status) {
        this.id = id,
        this.name = name
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }

    private refresh(data : Status|Status[]|null) {
        if ( !data ) {
            return false
        }
        if ( Array.isArray(data) ) {
            this.id = data[0].id
            this.name = data[0].name
            return true
        }
        this.id = data.id,
        this.name = data.name
        return true
    }
}