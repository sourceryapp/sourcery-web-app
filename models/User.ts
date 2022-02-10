import { supabase } from '~/plugins/supabase'
import { definitions } from '~/types/supabase'

const TABLE_NAME = 'user'

export class User {
    id: string
    name: string
    email: string
    created_at: string

    constructor({ id, name, email, created_at }: User) {
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

    private refreshFromSupabase(data : User|User[]) {
        if ( !data ) {
            return false
        }
        if ( Array.isArray(data) ) {
            this.id = data[0].id
            this.name = data[0].name
            this.email = data[0].email
            this.created_at = data[0].created_at
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
            return await supabase.from<definitions['user']>(TABLE_NAME)
                .update(this.toUpdateJSON())
                .eq('id', this.id)
        } else {
            throw Error('User object must contain an ID before saving.')
        }
    }
}