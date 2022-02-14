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

    public static async getById(user_id : string) {
        let { data: user, error } = await supabase.from<User>('user').select('*').eq('id', user_id)
        if ( Array.isArray(user) && user.length > 0 && user[0] && user[0].id ) {
            const u = new User(user[0])
            return u
        }
        return null
    }
}