import { supabase } from '~/plugins/supabase'

const TABLE_NAME = 'user'

export interface SourceryUser {
    id: string
    name: string
    email: string
    created_at: Date
}

export class User {
    id: string
    name: string
    email: string
    created_at: Date

    constructor({ id, name, email, created_at }: SourceryUser) {
        this.id = id
        this.name = name
        this.email = email
        this.created_at = created_at
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            created_at: this.created_at
        }
    }

    public toUpdateJSON() {
        return {
            name: this.name,
            email: this.email
        }
    }

    private refreshFromSupabase(data : SourceryUser|SourceryUser[]|null) {
        if ( !data ) {
            return false
        }
        if ( Array.isArray(data) ) {
            data = { ...data[0] }
            return true
        }
        this.id = data.id
        this.name = data.name
        this.email = data.email
        this.created_at = data.created_at
        return true
    }

    public async save() {
        if ( this.id ) {
            console.log('Property has an ID, update')
            return await supabase.from<SourceryUser>(TABLE_NAME)
                .update(this.toUpdateJSON())
                .eq('id', this.id)
        } else {
            throw Error('User object must contain an ID before saving.')
        }
    }
}